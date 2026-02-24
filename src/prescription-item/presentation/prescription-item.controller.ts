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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrescriptionItemService } from '../application/prescription-item.service';
import { CreatePrescriptionItemDto } from './dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';
import { PrescriptionItem } from '../domain/prescription-item.entity';

@ApiTags('prescription-items')
@Controller('prescriptions/:prescriptionId/items')
export class PrescriptionItemController {
  constructor(
    private readonly prescriptionItemService: PrescriptionItemService,
  ) {}

  @ApiOperation({ summary: 'Add an item to a prescription' })
  @Post()
  create(
    @Param('prescriptionId') prescriptionId: string,
    @Body() dto: CreatePrescriptionItemDto,
  ): Promise<PrescriptionItem> {
    return this.prescriptionItemService.create(prescriptionId, dto);
  }

  @ApiOperation({ summary: 'List all items of a prescription' })
  @Get()
  findAll(
    @Param('prescriptionId') prescriptionId: string,
  ): Promise<PrescriptionItem[]> {
    return this.prescriptionItemService.findAllByPrescription(prescriptionId);
  }

  @ApiOperation({ summary: 'Get a prescription item by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PrescriptionItem> {
    return this.prescriptionItemService.findById(id);
  }

  @ApiOperation({ summary: 'Update a prescription item' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionItemDto,
  ): Promise<PrescriptionItem> {
    return this.prescriptionItemService.update(id, dto);
  }

  @ApiOperation({ summary: 'Remove a prescription item' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.prescriptionItemService.remove(id);
  }
}
