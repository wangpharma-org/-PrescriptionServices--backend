import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStockSnapshotDto {
  @ApiProperty({ example: 'room-456', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roomId: string;

  @ApiProperty({ example: 'Main Storage Room', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  roomName: string;

  @ApiProperty({ example: '2024-03-02T10:30:00.000Z', type: 'string' })
  @IsISO8601()
  snapshotDate: string;

  @ApiPropertyOptional({ example: 'Monthly stock snapshot', type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;
}