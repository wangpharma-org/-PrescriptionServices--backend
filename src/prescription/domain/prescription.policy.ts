import { PrescriptionStatus } from "./prescription.entity";

const allowedTransitions: Record<PrescriptionStatus, PrescriptionStatus[]> = {
    [PrescriptionStatus.CREATED]: [
        PrescriptionStatus.WAITING_FOR_CART,
        PrescriptionStatus.HOLD,
    ],
    [PrescriptionStatus.WAITING_FOR_CART]: [
        PrescriptionStatus.PREPARING,
        PrescriptionStatus.CANCELLED,
    ],
    [PrescriptionStatus.PREPARING]: [
        PrescriptionStatus.CHECKING,
        PrescriptionStatus.CANCELLED,
    ],
    [PrescriptionStatus.CHECKING]: [
        PrescriptionStatus.DISPENSING,
        PrescriptionStatus.CANCELLED,
    ],
    [PrescriptionStatus.HOLD]: [
        PrescriptionStatus.WAITING_FOR_CART,
        PrescriptionStatus.CANCELLED,
    ],
    [PrescriptionStatus.DISPENSING]: [],    
    [PrescriptionStatus.CANCELLED]: [],
};

export function canTransitionStatus(
    currentStatus: PrescriptionStatus,
    newStatus: PrescriptionStatus,
): boolean {
    const allowedNextStatuses = allowedTransitions[currentStatus];
    return allowedNextStatuses.includes(newStatus);
}