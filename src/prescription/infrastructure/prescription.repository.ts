import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Prescription } from '../domain/prescription.entity';
import { IPrescriptionRepository } from '../domain/ports/prescription.repository.interface';

@Injectable()
export class PrescriptionRepository implements IPrescriptionRepository {
  constructor(
    @InjectRepository(Prescription)
    private readonly repository: Repository<Prescription>,
  ) {}

  findById(id: string): Promise<Prescription | null> {
    return this.repository.findOne({
      where: { id },
      relations: { items: true },
    });
  }

  findAndCount(
    options: FindManyOptions<Prescription>,
  ): Promise<[Prescription[], number]> {
    return this.repository.findAndCount(options);
  }

  create(data: Partial<Prescription>): Prescription {
    return this.repository.create(data);
  }

  save(prescription: Prescription): Promise<Prescription> {
    return this.repository.save(prescription);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
