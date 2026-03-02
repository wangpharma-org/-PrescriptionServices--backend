import { FindManyOptions } from 'typeorm';
import { StockSnapshot } from '../stocksnapshot.entity';

export interface IStockSnapshotRepository {
  findById(id: string): Promise<StockSnapshot | null>;
  findAndCount(options: FindManyOptions<StockSnapshot>): Promise<[StockSnapshot[], number]>;
  create(data: Partial<StockSnapshot>): StockSnapshot;
  save(stockSnapshot: StockSnapshot): Promise<StockSnapshot>;
  softDelete(id: string): Promise<void>;
  findByRoomId(roomId: string): Promise<StockSnapshot | null>;
}

export const STOCK_SNAPSHOT_REPOSITORY = Symbol('IStockSnapshotRepository');