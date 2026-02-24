import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PrescriptionItem } from '../../prescription-item/domain/prescription-item.entity';

export enum PrescriptionStatus {
  CREATED = "created",         
  WAITING_FOR_CART = "waiting_for_cart",    
  PREPARING = "preparing",           
  CHECKING = "checking",            
  DISPENSING = "dispensing",            
  CANCELLED = "cancelled",  
  HOLD = "hold",
}

@Entity({ name: 'prescriptions' })
export class Prescription extends BaseEntity {
  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ name: 'doctor_id', type: 'uuid' })
  doctorId: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'diagnosis', type: 'text', nullable: true })
  diagnosis: string | null;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription)
  items: PrescriptionItem[];

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.CREATED,
  })
  status: PrescriptionStatus;

  @Column({ name: 'issued_at', type: 'timestamp' })
  issuedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;
}
