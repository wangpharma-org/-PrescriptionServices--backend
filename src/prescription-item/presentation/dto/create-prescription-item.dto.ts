import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePrescriptionItemDto {
  @ApiProperty({ example: 'Amoxicillin', type: 'string' })
  @IsString()
  @IsNotEmpty()
  medicationName: string;

  @ApiProperty({ example: '500mg', type: 'string' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({ example: 'twice daily', type: 'string' })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({ example: '7 days', type: 'string' })
  @IsString()
  @IsNotEmpty()
  duration: string;

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
