import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PRESCRIPTION_ITEM_REPOSITORY,
  type IPrescriptionItemRepository,
} from '../domain/ports/prescription-item.repository.interface';
import { PrescriptionItem } from '../domain/prescription-item.entity';
import { CreatePrescriptionItemDto } from '../presentation/dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from '../presentation/dto/update-prescription-item.dto';
import { PrescriptionService } from '../../prescription/application/prescription.service';

@Injectable()
export class PrescriptionItemService {
  constructor(
    @Inject(PRESCRIPTION_ITEM_REPOSITORY)
    private readonly prescriptionItemRepository: IPrescriptionItemRepository,
    private readonly prescriptionService: PrescriptionService,
  ) {}

  async create(
    prescriptionId: string,
    dto: CreatePrescriptionItemDto,
  ): Promise<PrescriptionItem> {
    // Ensure parent prescription exists
    await this.prescriptionService.findById(prescriptionId);

    const item = this.prescriptionItemRepository.create({
      prescriptionId,
      medicationName: dto.medicationName,
      dosage: dto.dosage,
      frequency: dto.frequency,
      duration: dto.duration,
      quantity: dto.quantity ?? null,
      unit: dto.unit ?? null,
      instructions: dto.instructions ?? null,
    });

    return this.prescriptionItemRepository.save(item);
  }

  async findAllByPrescription(
    prescriptionId: string,
  ): Promise<PrescriptionItem[]> {
    // Ensure parent prescription exists
    await this.prescriptionService.findById(prescriptionId);

    return this.prescriptionItemRepository.findByPrescriptionId(prescriptionId);
  }

  async findById(id: string): Promise<PrescriptionItem> {
    const item = await this.prescriptionItemRepository.findById(id);

    if (!item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'prescriptionItemNotFound' },
      });
    }

    return item;
  }

  async update(
    id: string,
    dto: UpdatePrescriptionItemDto,
  ): Promise<PrescriptionItem> {
    const item = await this.findById(id);

    if (dto.medicationName !== undefined) item.medicationName = dto.medicationName;
    if (dto.dosage !== undefined) item.dosage = dto.dosage;
    if (dto.frequency !== undefined) item.frequency = dto.frequency;
    if (dto.duration !== undefined) item.duration = dto.duration;
    if (dto.quantity !== undefined) item.quantity = dto.quantity ?? null;
    if (dto.unit !== undefined) item.unit = dto.unit ?? null;
    if (dto.instructions !== undefined) item.instructions = dto.instructions ?? null;

    return this.prescriptionItemRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prescriptionItemRepository.softDelete(id);
  }
}
