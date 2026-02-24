import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MedicationDto {
  @ApiProperty({ example: 'Amoxicillin', type: 'string' })
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @ApiPropertyOptional({ example: 'Take with food', type: 'string' })
  @IsOptional()
  @IsString()
  instructions?: string;
}
