import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { MedicineSnapshotService } from '../application/medicinesnapshot.service';
import { MedicineSnapshot } from '../domain/medicinesnapshot.entity';

@ApiTags('medicine-snapshots')
@Controller('medicine-snapshots')
@Public()
export class MedicineSnapshotController {
  constructor(private readonly medicineSnapshotService: MedicineSnapshotService) {}

  @ApiOperation({ summary: 'Get medicine snapshot by ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotService.findById(id);
  }

  @ApiOperation({ summary: 'Get medicine snapshot by medicine code' })
  @Get('code/:medicineCode')
  findByMedicineCode(@Param('medicineCode') medicineCode: string): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotService.findByMedicineCode(medicineCode);
  }
}