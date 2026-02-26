import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices/client/client-kafka";
import { PrescriptionService } from "../application/prescription.service";
import { EventPattern } from "@nestjs/microservices/decorators/event-pattern.decorator";
import { Payload } from "@nestjs/microservices/decorators/payload.decorator";
import { PrescriptionStatus } from "../domain/prescription.entity";

@Controller()
export class PrescriptionEventsConsumer {
    constructor(
        private readonly prescriptionService: PrescriptionService,          
    ) {}

    @EventPattern('stock.reserved.v1')
    async handleStockReservedEvent(@Payload() message: any) {
        const { prescriptionId, reserveStatus } = message;

        console.log(`Received stock.reserved.v1 event for prescriptionId: ${prescriptionId} with reserveStatus: ${reserveStatus}`);

        if (reserveStatus === 'FAILED') {
            await this.prescriptionService.updatePrescriptionStatus(prescriptionId, PrescriptionStatus.HOLD);
        } else {
            await this.prescriptionService.updatePrescriptionStatus(prescriptionId, PrescriptionStatus.WAITING_FOR_CART);
        }
    }

    
}
