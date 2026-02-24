import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrescriptionItem } from '../domain/prescription-item.entity';
import { IPrescriptionItemRepository } from '../domain/ports/prescription-item.repository.interface';

@Injectable()
export class PrescriptionItemRepository implements IPrescriptionItemRepository {
  constructor(
    @InjectRepository(PrescriptionItem)
    private readonly repository: Repository<PrescriptionItem>,
  ) {}

  findById(id: string): Promise<PrescriptionItem | null> {
    return this.repository.findOneBy({ id });
  }

  findByPrescriptionId(prescriptionId: string): Promise<PrescriptionItem[]> {
    return this.repository.findBy({ prescriptionId });
  }

  create(data: Partial<PrescriptionItem>): PrescriptionItem {
    return this.repository.create(data);
  }

  save(item: PrescriptionItem): Promise<PrescriptionItem> {
    return this.repository.save(item);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
