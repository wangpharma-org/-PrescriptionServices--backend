import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './domain/prescription.entity';
import { PrescriptionItem } from '../prescription-item/domain/prescription-item.entity';
import { PrescriptionController } from './presentation/prescription.controller';
import { PrescriptionService } from './application/prescription.service';
import { PrescriptionRepository } from './infrastructure/prescription.repository';
import { PRESCRIPTION_REPOSITORY } from './domain/ports/prescription.repository.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MEDICINE_SNAPSHOT_REPOSITORY } from 'src/medicinesnapshot/domain/ports/medicinesnapshot.repository.interface';
import { PRESCRIPTION_ITEM_REPOSITORY } from 'src/prescription-item/domain/ports/prescription-item.repository.interface';
import { PrescriptionItemRepository } from 'src/prescription-item/infrastructure/prescription-item.repository';
import { PrescriptionEventsConsumer } from './presentation/prescription-event.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription, PrescriptionItem]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'prescription-service',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [PrescriptionController, PrescriptionEventsConsumer],
  providers: [
    PrescriptionService,
    { provide: PRESCRIPTION_REPOSITORY, useClass: PrescriptionRepository },
    { provide: MEDICINE_SNAPSHOT_REPOSITORY, useClass: PrescriptionRepository },
    {
      provide: PRESCRIPTION_ITEM_REPOSITORY,
      useClass: PrescriptionItemRepository,
    },
  ],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
