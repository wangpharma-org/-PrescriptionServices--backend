import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  STOCK_SNAPSHOT_REPOSITORY,
  type IStockSnapshotRepository,
} from '../domain/ports/stocksnapshot.repository.interface';
import { StockSnapshot } from '../domain/stocksnapshot.entity';
import { CreateStockSnapshotDto } from '../presentation/dto/create-stocksnapshot.dto';
import { UpdateStockSnapshotDto } from '../presentation/dto/update-stocksnapshot.dto';
import { FindStockSnapshotsQueryDto } from '../presentation/dto/find-stocksnapshots-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere, Between } from 'typeorm';

@Injectable()
export class StockSnapshotService {
  private readonly logger = new Logger(StockSnapshotService.name);

  constructor(
    @Inject(STOCK_SNAPSHOT_REPOSITORY)
    private readonly stockSnapshotRepository: IStockSnapshotRepository,
  ) {}

  async create(dto: CreateStockSnapshotDto): Promise<StockSnapshot> {
    const stockSnapshot = this.stockSnapshotRepository.create({
      roomId: dto.roomId,
      roomName: dto.roomName,
      snapshotDate: new Date(dto.snapshotDate),
      description: dto.description ?? null,
    });

    return this.stockSnapshotRepository.save(stockSnapshot);
  }

  async findAll(
    query: FindStockSnapshotsQueryDto,
  ): Promise<{ data: StockSnapshot[]; meta: PaginationMeta }> {
    const { 
      page, 
      limit, 
      roomId, 
      roomName, 
      snapshotDateFrom, 
      snapshotDateTo 
    } = query;
    
    const { skip, take } = buildPaginationOptions(page ?? 1, limit ?? 10);

    const where: FindOptionsWhere<StockSnapshot> = {};
    
    if (roomId) where.roomId = roomId;
    if (roomName) {
      // Use ILIKE for case-insensitive search (PostgreSQL)
      where.roomName = roomName;
    }
    
    if (snapshotDateFrom && snapshotDateTo) {
      where.snapshotDate = Between(new Date(snapshotDateFrom), new Date(snapshotDateTo));
    } else if (snapshotDateFrom) {
      where.snapshotDate = Between(new Date(snapshotDateFrom), new Date());
    } else if (snapshotDateTo) {
      where.snapshotDate = Between(new Date('1900-01-01'), new Date(snapshotDateTo));
    }

    const [data, total] = await this.stockSnapshotRepository.findAndCount({
      where,
      skip,
      take,
      order: { snapshotDate: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page ?? 1, limit ?? 10) };
  }

  async findById(id: string): Promise<StockSnapshot> {
    const stockSnapshot = await this.stockSnapshotRepository.findById(id);
    
    if (!stockSnapshot) {
      throw new NotFoundException(`Stock snapshot with ID ${id} not found`);
    }

    return stockSnapshot;
  }

  async update(id: string, dto: UpdateStockSnapshotDto): Promise<StockSnapshot> {
    const stockSnapshot = await this.findByRoomId(id);

    if (!stockSnapshot) {
      throw new NotFoundException(`Stock snapshot with ID ${id} not found`);
    }
    // Update only provided fields
    if (dto.roomId !== undefined) stockSnapshot.roomId = dto.roomId;
    if (dto.roomName !== undefined) stockSnapshot.roomName = dto.roomName;
    if (dto.snapshotDate !== undefined) stockSnapshot.snapshotDate = new Date(dto.snapshotDate);
    if (dto.description !== undefined) stockSnapshot.description = dto.description;

    return this.stockSnapshotRepository.save(stockSnapshot);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id); // Check if exists
    await this.stockSnapshotRepository.softDelete(id);
  }

  async findByRoomId(roomId: string): Promise<StockSnapshot | null> {
    return this.stockSnapshotRepository.findByRoomId(roomId);
  }

  async createBulkSnapshot(
    snapshots: CreateStockSnapshotDto[],
  ): Promise<StockSnapshot[]> {
    const createdSnapshots: StockSnapshot[] = [];

    for (const dto of snapshots) {
      try {
        const snapshot = await this.create(dto);
        createdSnapshots.push(snapshot);
      } catch (error) {
        this.logger.error(
          `Failed to create snapshot for room ${dto.roomId}: ${
            (error as Error).message
          }`,
        );
        // Continue with other snapshots
      }
    }

    return createdSnapshots;
  }
}