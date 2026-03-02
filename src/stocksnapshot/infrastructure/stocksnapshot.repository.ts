import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { StockSnapshot } from '../domain/stocksnapshot.entity';
import { IStockSnapshotRepository } from '../domain/ports/stocksnapshot.repository.interface';

@Injectable()
export class StockSnapshotRepository implements IStockSnapshotRepository {
  constructor(
    @InjectRepository(StockSnapshot)
    private readonly repository: Repository<StockSnapshot>,
  ) {}

  findById(id: string): Promise<StockSnapshot | null> {
    return this.repository.findOneBy({ id });
  }

  findAndCount(options: FindManyOptions<StockSnapshot>): Promise<[StockSnapshot[], number]> {
    return this.repository.findAndCount(options);
  }

  create(data: Partial<StockSnapshot>): StockSnapshot {
    return this.repository.create(data);
  }

  save(stockSnapshot: StockSnapshot): Promise<StockSnapshot> {
    return this.repository.save(stockSnapshot);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  findByRoomId(roomId: string): Promise<StockSnapshot | null> {
    return this.repository.findOne({
      where: { roomId },
      order: { snapshotDate: 'DESC' },
    });
  }
}