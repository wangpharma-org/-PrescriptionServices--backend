import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdatePrescriptionItemDto {
  @ApiPropertyOptional({ example: 'Amoxicillin', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName?: string;

  @ApiPropertyOptional({ example: '500mg', type: 'string' })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiPropertyOptional({ example: 'twice daily', type: 'string' })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional({ example: '7 days', type: 'string' })
  @IsOptional()
  @IsString()
  duration?: string;

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
