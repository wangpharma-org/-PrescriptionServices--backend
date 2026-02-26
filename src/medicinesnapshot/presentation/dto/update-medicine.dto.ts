import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMedicineSnapshotDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  medicineCode?: string;

  @IsString()
  @IsOptional()
  medicineName_en?: string;

  @IsString()
  @IsOptional()
  medicineName_th?: string;
}

export interface MedicineUpdatedEventDto {
  medicineId: string;
  info: {
    medicineCode: string;
    medicineName_en?: string;
    medicineName_th?: string;
  };
}