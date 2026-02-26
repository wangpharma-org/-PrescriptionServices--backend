import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicineSnapshot } from '../domain/medicinesnapshot.entity';
import { IMedicineSnapshotRepository } from '../domain/ports/medicinesnapshot.repository.interface';

@Injectable()
export class MedicineSnapshotRepository implements IMedicineSnapshotRepository {
  constructor(
    @InjectRepository(MedicineSnapshot)
    private readonly repository: Repository<MedicineSnapshot>,
  ) {}

  async findById(id: string): Promise<MedicineSnapshot | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByMedicineCode(
    medicineCode: string,
  ): Promise<MedicineSnapshot | null> {
    return this.repository.findOne({ where: { medicineCode } });
  }

  create(data: Partial<MedicineSnapshot>): MedicineSnapshot {
    return this.repository.create(data);
  }

  async save(medicineSnapshot: MedicineSnapshot): Promise<MedicineSnapshot> {
    return this.repository.save(medicineSnapshot);
  }

  async update(
    id: string,
    data: Partial<MedicineSnapshot>,
  ): Promise<MedicineSnapshot> {
    await this.repository.update({ id }, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`MedicineSnapshot with id ${id} not found`);
    }
    return updated;
  }
}