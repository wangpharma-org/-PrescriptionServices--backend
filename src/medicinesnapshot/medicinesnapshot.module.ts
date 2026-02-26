import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineSnapshot } from './domain/medicinesnapshot.entity';
import { MedicineSnapshotService } from './application/medicinesnapshot.service';
import { MedicineSnapshotRepository } from './infrastructure/medicinesnapshot.repository';
import { MEDICINE_SNAPSHOT_REPOSITORY } from './domain/ports/medicinesnapshot.repository.interface';
import { MedicineSnapshotEventsConsumer } from './presentation/medicinesnapshot-events.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([MedicineSnapshot])],
  controllers: [MedicineSnapshotEventsConsumer],
  providers: [
    MedicineSnapshotService,
    { provide: MEDICINE_SNAPSHOT_REPOSITORY, useClass: MedicineSnapshotRepository },
  ],
  exports: [MedicineSnapshotService],
})
export class MedicineSnapshotModule {}