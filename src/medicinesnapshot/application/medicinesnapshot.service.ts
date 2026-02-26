import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  MEDICINE_SNAPSHOT_REPOSITORY,
  type IMedicineSnapshotRepository,
} from '../domain/ports/medicinesnapshot.repository.interface';
import { MedicineSnapshot } from '../domain/medicinesnapshot.entity';
import { CreateMedicineSnapshotDto } from '../presentation/dto/create-medicine.dto';
import { UpdateMedicineSnapshotDto } from '../presentation/dto/update-medicine.dto';

@Injectable()
export class MedicineSnapshotService {
  private readonly logger = new Logger(MedicineSnapshotService.name);

  constructor(
    @Inject(MEDICINE_SNAPSHOT_REPOSITORY)
    private readonly medicineSnapshotRepository: IMedicineSnapshotRepository,
  ) {}

  async create(dto: CreateMedicineSnapshotDto): Promise<MedicineSnapshot> {
    this.logger.log(`Creating new MedicineSnapshot for code: ${dto.medicineCode}`);
    
    const medicineSnapshot = this.medicineSnapshotRepository.create({
      id: dto.id,
      medicineCode: dto.medicineCode,
      medicineName_en: dto.medicineName_en ?? null,
      medicineName_th: dto.medicineName_th ?? null,
    });

    return this.medicineSnapshotRepository.save(medicineSnapshot);
  }

  async update(dto: UpdateMedicineSnapshotDto): Promise<MedicineSnapshot> {
    this.logger.log(`Updating existing MedicineSnapshot with id: ${dto.id}`);
    
    return this.medicineSnapshotRepository.update(dto.id, {
      medicineCode: dto.medicineCode,
      medicineName_en: dto.medicineName_en ?? null,
      medicineName_th: dto.medicineName_th ?? null,
    });
  }

  async findByMedicineCode(
    medicineCode: string,
  ): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotRepository.findByMedicineCode(medicineCode);
  }

  async findById(id: string): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotRepository.findById(id);
  }
}