import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { MedicineSnapshotService } from '../application/medicinesnapshot.service';
import { MedicineSnapshot } from '../domain/medicinesnapshot.entity';
import { FindMedicinesQueryDto } from './dto/find-medicines-query.dto';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('medicine-snapshots')
@Controller('medicine-snapshots')
@Public()
export class MedicineSnapshotController {
  constructor(
    private readonly medicineSnapshotService: MedicineSnapshotService,
  ) {}

  @ApiOperation({ summary: 'List medicine snapshots with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindMedicinesQueryDto,
  ): Promise<{ data: MedicineSnapshot[]; meta: PaginationMeta }> {
    return this.medicineSnapshotService.findAll(query);
  }

  @ApiOperation({ summary: 'Get medicine snapshot by ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotService.findById(id);
  }

  @ApiOperation({ summary: 'Get medicine snapshot by medicine code' })
  @Get('code/:medicineCode')
  findByMedicineCode(
    @Param('medicineCode') medicineCode: string,
  ): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotService.findByMedicineCode(medicineCode);
  }
}
