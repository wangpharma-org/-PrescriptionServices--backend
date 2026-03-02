import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsISO8601, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindStockSnapshotsQueryDto {
  @ApiPropertyOptional({ example: 1, type: 'number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, type: 'number', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'room-456', type: 'string' })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiPropertyOptional({ example: 'Storage', type: 'string' })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiPropertyOptional({ example: '2024-03-01T00:00:00.000Z', type: 'string' })
  @IsOptional()
  @IsISO8601()
  snapshotDateFrom?: string;

  @ApiPropertyOptional({ example: '2024-03-31T23:59:59.999Z', type: 'string' })
  @IsOptional()
  @IsISO8601()
  snapshotDateTo?: string;
}