import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockSnapshot } from './domain/stocksnapshot.entity';
import { StockSnapshotController } from './presentation/stocksnapshot.controller';
import { StockSnapshotService } from './application/stocksnapshot.service';
import { StockSnapshotRepository } from './infrastructure/stocksnapshot.repository';
import { STOCK_SNAPSHOT_REPOSITORY } from './domain/ports/stocksnapshot.repository.interface';
import { StockSnapshotEventConsumer } from './presentation/stocksnapshot-events.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockSnapshot]),
  ],
  controllers: [StockSnapshotController, StockSnapshotEventConsumer],
  providers: [
    StockSnapshotService,
    { provide: STOCK_SNAPSHOT_REPOSITORY, useClass: StockSnapshotRepository },
  ],
  exports: [StockSnapshotService],
})
export class StockSnapshotModule {}