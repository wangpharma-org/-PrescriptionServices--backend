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
  @Column({ name: 'vn', type: 'varchar', length: 255 })
  vn: string;
  
  @Column({ name: 'hn', type: 'varchar', length: 255 })
  hn: string;

  @Column({ name: 'patient_name`', type: 'varchar', length: 255 })
  patientName: string;

  @Column({ name: 'patient_code', type: 'varchar', length: 255 })
  patientCode: string;

  @Column({ name: 'age', type: 'int' })
  age: number;

  @Column({ name: 'gender', type: 'varchar', length: 50 })
  gender: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ name: 'address', type: 'varchar', length: 500})
  address: string;

  @Column({ name: 'room_id', type: 'uuid', nullable: true })
  roomId: string;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription)
  items: PrescriptionItem[];

  @Column({
    name: 'status',
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.CREATED,
  })
  status: PrescriptionStatus;
}
