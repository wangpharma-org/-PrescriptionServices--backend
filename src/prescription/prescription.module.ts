import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './domain/prescription.entity';
import { PrescriptionItem } from '../prescription-item/domain/prescription-item.entity';
import { PrescriptionController } from './presentation/prescription.controller';
import { PrescriptionService } from './application/prescription.service';
import { PrescriptionRepository } from './infrastructure/prescription.repository';
import { PRESCRIPTION_REPOSITORY } from './domain/ports/prescription.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, PrescriptionItem])],
  controllers: [PrescriptionController],
  providers: [
    PrescriptionService,
    { provide: PRESCRIPTION_REPOSITORY, useClass: PrescriptionRepository },
  ],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
