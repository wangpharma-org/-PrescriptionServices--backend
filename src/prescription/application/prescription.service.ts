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
import {
  Prescription,
  PrescriptionStatus,
} from '../domain/prescription.entity';
import { UpdatePrescriptionDto } from '../presentation/dto/update-prescription.dto';
import { FindPrescriptionsQueryDto } from '../presentation/dto/find-prescriptions-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import {
  PrescriptionItem,
  PrescriptionItemStatus,
} from 'src/prescription-item/domain/prescription-item.entity';
import { canTransitionStatus } from '../domain/prescription.policy';
import {
  type IMedicineSnapshotRepository,
  MEDICINE_SNAPSHOT_REPOSITORY,
} from 'src/medicinesnapshot/domain/ports/medicinesnapshot.repository.interface';
import {
  type IPrescriptionItemRepository,
  PRESCRIPTION_ITEM_REPOSITORY,
} from 'src/prescription-item/domain/ports/prescription-item.repository.interface';
import { CreatePrescriptionDto } from '../presentation/dto/create-prescription.dto';
import { MedicineSnapshot } from 'src/medicinesnapshot/domain/medicinesnapshot.entity';

@Injectable()
export class PrescriptionService {
  private readonly logger = new Logger(PrescriptionService.name);

  constructor(
    @Inject(PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: IPrescriptionRepository,
    @Inject(MEDICINE_SNAPSHOT_REPOSITORY)
    private readonly medicineSnapshotRepository: IMedicineSnapshotRepository,
    @Inject(PRESCRIPTION_ITEM_REPOSITORY)
    private readonly prescriptionItemRepository: IPrescriptionItemRepository,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePrescriptionDto): Promise<Prescription> {
    return this.dataSource.transaction(async (manager) => {
      const prescriptionRepo = manager.getRepository(Prescription);
      const itemRepo = manager.getRepository(PrescriptionItem);
      const medicineSnapshotRepo = manager.getRepository(MedicineSnapshot);

      const prescription = prescriptionRepo.create({
        vn: dto.vn,
        hn: dto.hn,
        patientName: dto.patientName,
        patientCode: dto.patientCode,
        age: dto.age,
        gender: dto.gender,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        roomId: dto.roomId,
        status: PrescriptionStatus.CREATED,
      });

      const savedPrescription = await prescriptionRepo.save(prescription);

      const items = await Promise.all(
        dto.items.map(async (item) => {
          const medicineInfo = await medicineSnapshotRepo.findOne({
            where: { id: item.medicineId },
          });

          this.logger.log(`medicineInfo: ${JSON.stringify(medicineInfo)}`);
          this.logger.log(
            `Fetched medicine snapshot for medicine ID ${item.medicineId}: ${medicineInfo ? 'FOUND' : 'NOT FOUND'}`,
          );
          if (!medicineInfo) {
            this.logger.warn(
              `MedicineSnapshot with ID ${item.medicineId} not found for prescription item in prescription ID ${savedPrescription.id}`,
            );
          }

          return itemRepo.create({
            prescriptionId: savedPrescription.id,
            medicineCode: medicineInfo?.medicineCode ?? 'UNKNOWN',
            medicineName: medicineInfo?.medicineName_en ?? 'UNKNOWN',
            quantity: item.quantity ?? null,
            unit: item.unit ?? null,
            instructions: item.instructions ?? null,
          });
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
          })),
        });
      } catch (error) {
        this.logger.error(
          'Failed to emit prescription.created.v1 event',
          error,
        );
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
    if (status) where.status = status;

    const [data, total] = await this.prescriptionRepository.findAndCount({
      where,
      skip,
      take,
      relations: { items: true },
      order: { createdAt: 'DESC' },
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

    if (dto.status !== undefined) {
      if (!canTransitionStatus(prescription.status, dto.status)) {
        this.logger.warn(
          `Invalid status transition from ${prescription.status} to ${dto.status} for prescription ID ${prescription.id}`,
        );
        return prescription;
      }
      prescription.status = dto.status;
    }

    return this.prescriptionRepository.save(prescription);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prescriptionRepository.softDelete(id);
  }

  async updatePrescriptionStatus(
    prescriptionId: string,
    status: PrescriptionStatus,
  ): Promise<void> {
    const prescription =
      await this.prescriptionRepository.findById(prescriptionId);
    if (!prescription) {
      this.logger.warn(
        `Prescription with ID ${prescriptionId} not found for status update`,
      );
      return;
    }

    if (!canTransitionStatus(prescription.status, status)) {
      this.logger.warn(
        `Invalid status transition from ${prescription.status} to ${status} for prescription ID ${prescriptionId}`,
      );
      return;
    }

    prescription.status = status;

    await this.prescriptionRepository.save(prescription);
    
    if (
      status === PrescriptionStatus.WAITING_FOR_CART
    ) {
      try {
        const prescriptionItems =
          await this.prescriptionItemRepository.findByPrescriptionId(
            prescriptionId,
          );

        for (const item of prescriptionItems) {
          if (item.status === PrescriptionItemStatus.PENDING) {
            item.status = PrescriptionItemStatus.RESERVED;
            await this.prescriptionItemRepository.save(item);
          }
        }

        this.logger.log(
          `Updated ${prescriptionItems.length} prescription items to RESERVED status for prescription ID ${prescriptionId}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to update prescription items status for prescription ID ${prescriptionId}:`,
          error,
        );
      }
    }
  }
}
