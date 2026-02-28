import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'medicine_snapshots' })
@Unique(['medicineCode'])
export class MedicineSnapshot extends BaseEntity {
  @Column({ name: 'medicine_code', type: 'varchar', length: 255 })
  medicineCode: string;

  @Column({ name: 'medicine_name_en', type: 'varchar', nullable: true })
  medicineName_en: string | null;

  @Column({ name: 'medicine_name_th', type: 'varchar', nullable: true })
  medicineName_th: string | null;
}
