import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  PRESCRIPTION_REPOSITORY,
  type IPrescriptionRepository,
} from '../domain/ports/prescription.repository.interface';
import { Prescription, PrescriptionStatus } from '../domain/prescription.entity';
import { CreatePrescriptionDto } from '../presentation/dto/create-prescription.dto';
import { UpdatePrescriptionDto } from '../presentation/dto/update-prescription.dto';
import { FindPrescriptionsQueryDto } from '../presentation/dto/find-prescriptions-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { DataSource, FindOptionsWhere, In } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import { PrescriptionItem } from 'src/prescription-item/domain/prescription-item.entity';
import { canTransitionStatus } from '../domain/prescription.policy';

@Injectable()
export class PrescriptionService {
  private readonly logger = new Logger(PrescriptionService.name);

  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: IPrescriptionRepository,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePrescriptionDto): Promise<Prescription> {
    return this.dataSource.transaction(async (manager) => {
      const prescriptionRepo = manager.getRepository(Prescription);
      const itemRepo = manager.getRepository(PrescriptionItem);

      const prescription = prescriptionRepo.create({
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        diagnosis: dto.diagnosis ?? null,
        notes: dto.notes ?? null,
        status: PrescriptionStatus.CREATED,
        issuedAt: new Date(dto.issuedAt),
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      });

      const savedPrescription = await prescriptionRepo.save(prescription);

      const items = dto.items.map((item) =>
        itemRepo.create({
          prescriptionId: savedPrescription.id,
          medicationName: item.medicationName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity ?? null,
          unit: item.unit ?? null,
          instructions: item.instructions ?? null,
        }),
      );

      savedPrescription.items = await itemRepo.save(items);

      try {
        await this.kafkaClient.emit('prescription.created.v1', {
          prescriptionId: savedPrescription.id,
          roomId: savedPrescription.roomId,
          items: savedPrescription.items.map((item) => ({
            medicineCode: item.medicineCode, 
            requiredQuantity: item.quantity,
          })
        )});
      } catch (error) {
        this.logger.error('Failed to emit prescription.created.v1 event', error);
      }

      return savedPrescription;
    });
  }

  async findAll(
    query: FindPrescriptionsQueryDto,
  ): Promise<{ data: Prescription[]; meta: PaginationMeta }> {
    const { page, limit, patientId, doctorId, status } = query;
    const { skip, take } = buildPaginationOptions(page, limit);

    const where: FindOptionsWhere<Prescription> = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const [data, total] = await this.prescriptionRepository.findAndCount({
      where,
      skip,
      take,
      order: { issuedAt: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findById(id);

    if (!prescription) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'prescriptionNotFound' },
      });
    }

    return prescription;
  }

  async update(id: string, dto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.findById(id);

    if (dto.diagnosis !== undefined) prescription.diagnosis = dto.diagnosis;
    if (dto.notes !== undefined) prescription.notes = dto.notes;
    if (dto.status !== undefined) {
      if (!canTransitionStatus(prescription.status, dto.status)) {
        this.logger.warn(`Invalid status transition from ${prescription.status} to ${dto.status} for prescription ID ${prescription.id}`);
        return prescription;
      }
      prescription.status = dto.status;
    }
    if (dto.expiresAt !== undefined) {
      prescription.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }

    return this.prescriptionRepository.save(prescription);
  }

  async remove(id: string): Promise<void> {
    
    await this.findById(id);
    await this.prescriptionRepository.softDelete(id);
  }

  async updatePrescriptionStatus(prescriptionId: string, status: PrescriptionStatus): Promise<void> {
    const prescription = await this.prescriptionRepository.findById(prescriptionId);
    if (!prescription) {
      this.logger.warn(`Prescription with ID ${prescriptionId} not found for status update`);
      return;
    }

    if (!canTransitionStatus(prescription.status, status)) {
      this.logger.warn(`Invalid status transition from ${prescription.status} to ${status} for prescription ID ${prescriptionId}`);
      return;
    }

    prescription.status = status;

    await this.prescriptionRepository.save(prescription);
  }
}
