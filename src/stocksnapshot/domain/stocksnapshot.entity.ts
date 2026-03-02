import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'stock_snapshots' })
export class StockSnapshot extends BaseEntity {

  @Column({ name: 'room_id', type: 'varchar', length: 255, unique: true })
  roomId: string;

  @Column({ name: 'room_name', type: 'varchar', length: 255 })
  roomName: string;
  
  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'snapshot_date', type: 'timestamp' })
  snapshotDate: Date;

}