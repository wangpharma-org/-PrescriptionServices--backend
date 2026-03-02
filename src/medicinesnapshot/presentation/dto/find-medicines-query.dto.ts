import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindMedicinesQueryDto {
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

  @ApiPropertyOptional({ example: 'MED001', type: 'string' })
  @IsOptional()
  @IsString()
  medicineCode?: string;

  @ApiPropertyOptional({ example: 'Paracetamol', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName_en?: string;
}