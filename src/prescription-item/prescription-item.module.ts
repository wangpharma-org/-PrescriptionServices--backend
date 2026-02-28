import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionItem } from './domain/prescription-item.entity';
import { PrescriptionItemController } from './presentation/prescription-item.controller';
import { PrescriptionItemService } from './application/prescription-item.service';
import { PrescriptionItemRepository } from './infrastructure/prescription-item.repository';
import { PRESCRIPTION_ITEM_REPOSITORY } from './domain/ports/prescription-item.repository.interface';
import { PrescriptionModule } from '../prescription/prescription.module';

@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionItem]), PrescriptionModule],
  controllers: [PrescriptionItemController],
  providers: [
    PrescriptionItemService,
    {
      provide: PRESCRIPTION_ITEM_REPOSITORY,
      useClass: PrescriptionItemRepository,
    },
  ],
  exports: [PrescriptionItemService],
})
export class PrescriptionItemModule {}
