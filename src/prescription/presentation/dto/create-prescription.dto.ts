import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePrescriptionItemByPrescriptionDto } from '../../../prescription-item/presentation/dto/create-prescription-item.dto';

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Visit Number' })
  @IsString()
  @IsNotEmpty()
  vn: string;

  @ApiProperty({ description: 'Hospital Number' })
  @IsString()
  @IsNotEmpty()
  hn: string;

  @ApiProperty({ description: 'Patient name' })
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiProperty({ description: 'Patient code' })
  @IsString()
  @IsNotEmpty()
  patientCode: string;

  @ApiProperty({ description: 'Patient age' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ description: 'Patient gender' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ description: 'Patient phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Patient address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Room ID (optional)' })
  @IsString()
  @IsNotEmpty()
  roomId?: string;

  @ApiProperty({ type: [CreatePrescriptionItemByPrescriptionDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemByPrescriptionDto)
  items: CreatePrescriptionItemByPrescriptionDto[];
}
