import { FindManyOptions } from 'typeorm';
import { MedicineSnapshot } from '../medicinesnapshot.entity';

export interface IMedicineSnapshotRepository {
  findById(id: string): Promise<MedicineSnapshot | null>;
  findByMedicineCode(medicineCode: string): Promise<MedicineSnapshot | null>;
  findAndCount(options: FindManyOptions<MedicineSnapshot>): Promise<[MedicineSnapshot[], number]>;
  create(data: Partial<MedicineSnapshot>): MedicineSnapshot;
  save(medicineSnapshot: MedicineSnapshot): Promise<MedicineSnapshot>;
  update(
    id: string,
    data: Partial<MedicineSnapshot>,
  ): Promise<MedicineSnapshot>;
}

export const MEDICINE_SNAPSHOT_REPOSITORY = Symbol(
  'IMedicineSnapshotRepository',
);
