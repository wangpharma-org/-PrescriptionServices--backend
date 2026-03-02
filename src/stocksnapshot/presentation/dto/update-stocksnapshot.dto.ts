import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateStockSnapshotDto } from './create-stocksnapshot.dto';

export class UpdateStockSnapshotDto extends PartialType(CreateStockSnapshotDto) {
  @ApiPropertyOptional({ example: 'room-456', type: 'string' })
  roomId?: string;

  @ApiPropertyOptional({ example: 'Main Storage Room', type: 'string' })
  roomName?: string;

  @ApiPropertyOptional({ example: '2024-03-02T10:30:00.000Z', type: 'string' })
  snapshotDate?: string;

  @ApiPropertyOptional({ example: 'Updated monthly stock snapshot', type: 'string' })
  description?: string;
}