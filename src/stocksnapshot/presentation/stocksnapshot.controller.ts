import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockSnapshotService } from '../application/stocksnapshot.service';
import { CreateStockSnapshotDto } from './dto/create-stocksnapshot.dto';
import { UpdateStockSnapshotDto } from './dto/update-stocksnapshot.dto';
import { FindStockSnapshotsQueryDto } from './dto/find-stocksnapshots-query.dto';
import { StockSnapshot } from '../domain/stocksnapshot.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('stock-snapshots')
@Controller('stock-snapshots')
export class StockSnapshotController {
  constructor(private readonly stockSnapshotService: StockSnapshotService) {}

  @ApiOperation({ summary: 'Create a new stock snapshot' })
  @Post()
  create(@Body() dto: CreateStockSnapshotDto): Promise<StockSnapshot> {
    return this.stockSnapshotService.create(dto);
  }

  @ApiOperation({ summary: 'Create multiple stock snapshots' })
  @Post('bulk')
  createBulk(@Body() dtos: CreateStockSnapshotDto[]): Promise<StockSnapshot[]> {
    return this.stockSnapshotService.createBulkSnapshot(dtos);
  }

  @ApiOperation({ summary: 'List stock snapshots with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindStockSnapshotsQueryDto,
  ): Promise<{ data: StockSnapshot[]; meta: PaginationMeta }> {
    return this.stockSnapshotService.findAll(query);
  }

  @ApiOperation({ summary: 'Get stock snapshot by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<StockSnapshot> {
    return this.stockSnapshotService.findById(id);
  }

  @ApiOperation({ summary: 'Get stock snapshots by room ID' })
  @Get('room/:roomId')
  findByRoomId(@Param('roomId') roomId: string): Promise<StockSnapshot | null> {
    return this.stockSnapshotService.findByRoomId(roomId);
  }

  @ApiOperation({ summary: 'Update stock snapshot' })
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() dto: UpdateStockSnapshotDto
  ): Promise<StockSnapshot> {
    return this.stockSnapshotService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete stock snapshot' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.stockSnapshotService.remove(id);
  }
}