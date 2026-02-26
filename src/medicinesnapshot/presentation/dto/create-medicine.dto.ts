import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMedicineSnapshotDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  medicineCode: string;

  @IsString()
  @IsOptional()
  medicineName_en?: string;

  @IsString()
  @IsOptional()
  medicineName_th?: string;
}

export interface MedicineCreatedEventDto {
  medicineId: string;
  roomId: string;
  info: {
    medicineCode: string;
    medicineName_en?: string;
    medicineName_th?: string;
  };
}