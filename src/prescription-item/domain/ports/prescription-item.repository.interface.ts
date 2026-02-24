import { PrescriptionItem } from '../prescription-item.entity';

export interface IPrescriptionItemRepository {
  findById(id: string): Promise<PrescriptionItem | null>;
  findByPrescriptionId(prescriptionId: string): Promise<PrescriptionItem[]>;
  create(data: Partial<PrescriptionItem>): PrescriptionItem;
  save(item: PrescriptionItem): Promise<PrescriptionItem>;
  softDelete(id: string): Promise<void>;
}

export const PRESCRIPTION_ITEM_REPOSITORY = Symbol(
  'IPrescriptionItemRepository',
);
