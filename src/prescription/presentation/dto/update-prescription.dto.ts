import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrescriptionStatus } from '../../domain/prescription.entity';

export class UpdatePrescriptionDto {
  @ApiPropertyOptional({ example: 'J06.9 Acute upper respiratory infection', type: 'string' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Follow up in 2 weeks.', type: 'string' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: PrescriptionStatus })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiPropertyOptional({ example: '2026-03-23T00:00:00.000Z', type: 'string' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
