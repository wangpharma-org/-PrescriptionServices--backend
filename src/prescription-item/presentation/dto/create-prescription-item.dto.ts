import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePrescriptionItemByPrescriptionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', type: 'string' })
  @IsUUID('4')
  @IsNotEmpty()
  medicineId: string;

  @ApiPropertyOptional({ example: 14, type: 'number' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional({ example: 'tablet', type: 'string' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 'Take with food', type: 'string' })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreatePrescriptionItemDto {
  @ApiProperty({ example: 'Paracetamol', type: 'string' })
  @IsString()
  @IsNotEmpty()
  medicineName: string;

  @ApiPropertyOptional({ example: 14, type: 'number' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional({ example: 'tablet', type: 'string' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 'Take with food', type: 'string' })
  @IsOptional()
  @IsString()
  instructions?: string;
}