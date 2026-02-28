import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrescriptionService } from '../application/prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { FindPrescriptionsQueryDto } from './dto/find-prescriptions-query.dto';
import { Prescription } from '../domain/prescription.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @ApiOperation({ summary: 'Create a new prescription' })
  @Post()
  create(@Body() dto: CreatePrescriptionDto): Promise<Prescription> {
    return this.prescriptionService.create(dto);
  }

  @ApiOperation({ summary: 'List prescriptions with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindPrescriptionsQueryDto,
  ): Promise<{ data: Prescription[]; meta: PaginationMeta }> {
    return this.prescriptionService.findAll(query);
  }

  @ApiOperation({ summary: 'Get prescription by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Prescription> {
    return this.prescriptionService.findById(id);
  }

  @ApiOperation({ summary: 'Update prescription' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete (soft-delete) prescription' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.prescriptionService.remove(id);
  }
}
