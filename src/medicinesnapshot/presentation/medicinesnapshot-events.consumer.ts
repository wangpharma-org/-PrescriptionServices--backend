import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MedicineSnapshotService } from "../application/medicinesnapshot.service";
import type { MedicineCreatedEventDto } from "./dto/create-medicine.dto";
import type { MedicineUpdatedEventDto } from "./dto/update-medicine.dto";

@Controller()
export class MedicineSnapshotEventsConsumer {
    private readonly logger = new Logger(MedicineSnapshotEventsConsumer.name);

    constructor(
        private readonly medicineSnapshotService: MedicineSnapshotService,          
    ) {}

    @EventPattern('medicine.created.v1')
    async handleMedicineCreatedEvent(@Payload() message: MedicineCreatedEventDto): Promise<void> {
        this.logger.log(`Received medicine.created.v1 event for medicine: ${message.medicineId}`);
        
        await this.medicineSnapshotService.create({
            id: message.medicineId,
            medicineCode: message.info.medicineCode,
            medicineName_en: message.info.medicineName_en,
            medicineName_th: message.info.medicineName_th,
        });
    }

    @EventPattern('medicine.updated.v1')
    async handleMedicineUpdatedEvent(@Payload() message: MedicineUpdatedEventDto): Promise<void> {
        this.logger.log(`Received medicine.updated.v1 event for medicine: ${message.medicineId}`);
        
        await this.medicineSnapshotService.update({
            id: message.medicineId,
            medicineCode: message.info.medicineCode,
            medicineName_en: message.info.medicineName_en,
            medicineName_th: message.info.medicineName_th,
        });
    }
}