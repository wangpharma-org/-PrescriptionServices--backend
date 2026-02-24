import { FindManyOptions } from 'typeorm';
import { Prescription } from '../prescription.entity';

export interface IPrescriptionRepository {
  findById(id: string): Promise<Prescription | null>;
  findByPatientId(patientId: string): Promise<Prescription[]>;
  findByDoctorId(doctorId: string): Promise<Prescription[]>;
  findAndCount(
    options: FindManyOptions<Prescription>,
  ): Promise<[Prescription[], number]>;
  create(data: Partial<Prescription>): Prescription;
  save(prescription: Prescription): Promise<Prescription>;
  softDelete(id: string): Promise<void>;
}

export const PRESCRIPTION_REPOSITORY = Symbol('IPrescriptionRepository');
