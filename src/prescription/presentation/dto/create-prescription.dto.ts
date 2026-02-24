import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrescriptionStatus } from '../../domain/prescription.entity';
import { CreatePrescriptionItemDto } from '../../../prescription-item/presentation/dto/create-prescription-item.dto';

export class CreatePrescriptionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    example: '223e4567-e89b-12d3-a456-426614174001',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  doctorId: string;

  @ApiPropertyOptional({ example: 'J06.9 Acute upper respiratory infection', type: 'string' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Follow up in 1 week.', type: 'string' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    enum: PrescriptionStatus,
    default: PrescriptionStatus.CREATED,
  })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiProperty({ example: '2026-02-23T00:00:00.000Z', type: 'string' })
  @IsDateString()
  @IsNotEmpty()
  issuedAt: string;

  @ApiPropertyOptional({ example: '2026-03-23T00:00:00.000Z', type: 'string' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({ type: [CreatePrescriptionItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items: CreatePrescriptionItemDto[];
}
