import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Prescription, PrescriptionStatus } from '../../prescription/domain/prescription.entity';

export enum PrescriptionItemStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity({ name: 'prescription_items' })
export class PrescriptionItem extends BaseEntity {
  @Column({ name: 'prescription_id', type: 'uuid' })
  prescriptionId: string;

  @ManyToOne(() => Prescription, (prescription) => prescription.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prescription_id' })
  prescription: Prescription;

    @Column({
      name: 'status',
      type: 'enum',
      enum: PrescriptionItemStatus,
      default: PrescriptionItemStatus.PENDING,
    })
    status: PrescriptionItemStatus;

  @Column({ name: 'medicine_code', type: 'varchar' })
  medicineCode: string;
  
  @Column({ name: 'medication_name', type: 'varchar' })
  medicationName: string;

  @Column({ name: 'dosage', type: 'varchar' })
  dosage: string;

  @Column({ name: 'frequency', type: 'varchar' })
  frequency: string;

  @Column({ name: 'duration', type: 'varchar' })
  duration: string;

  @Column({ name: 'quantity', type: 'int', nullable: true })
  quantity: number | null;

  @Column({ name: 'unit', type: 'varchar', nullable: true })
  unit: string | null;

  @Column({ name: 'instructions', type: 'text', nullable: true })
  instructions: string | null;
}
