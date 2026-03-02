import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  MEDICINE_SNAPSHOT_REPOSITORY,
  type IMedicineSnapshotRepository,
} from '../domain/ports/medicinesnapshot.repository.interface';
import { MedicineSnapshot } from '../domain/medicinesnapshot.entity';
import { CreateMedicineSnapshotDto } from '../presentation/dto/create-medicine.dto';
import { UpdateMedicineSnapshotDto } from '../presentation/dto/update-medicine.dto';
import { FindMedicinesQueryDto } from '../presentation/dto/find-medicines-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere, ILike } from 'typeorm';

@Injectable()
export class MedicineSnapshotService {
  private readonly logger = new Logger(MedicineSnapshotService.name);

  constructor(
    @Inject(MEDICINE_SNAPSHOT_REPOSITORY)
    private readonly medicineSnapshotRepository: IMedicineSnapshotRepository,
  ) {}

  async create(dto: CreateMedicineSnapshotDto): Promise<MedicineSnapshot> {
    this.logger.log(
      `Creating new MedicineSnapshot for code: ${dto.medicineCode}`,
    );

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

  async findAll(
    query: FindMedicinesQueryDto,
  ): Promise<{ data: MedicineSnapshot[]; meta: PaginationMeta }> {
    const { page, limit, medicineCode, medicineName_en } = query;
    
    const { skip, take } = buildPaginationOptions(page ?? 1, limit ?? 10);

    const where: FindOptionsWhere<MedicineSnapshot> = {};
    
    if (medicineCode) where.medicineCode = medicineCode;
    if (medicineName_en) {
      // Search in both English and Thai names using ILIKE for case-insensitive search
      where.medicineName_en = ILike(`%${medicineName_en}%`);
      // TODO: Add OR condition for medicineName_th when TypeORM supports it better
    }

    const [data, total] = await this.medicineSnapshotRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page ?? 1, limit ?? 10) };
  }
}
