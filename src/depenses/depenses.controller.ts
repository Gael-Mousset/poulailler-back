import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DepensesService } from './depenses.service';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { UpdateDepenseDto } from './dto/update-depense.dto';

@Controller('depenses')
export class DepensesController {
  constructor(private readonly depensesService: DepensesService) {}

  @Post()
  create(@Body() dto: CreateDepenseDto) {
    return this.depensesService.create(dto);
  }

  @Get()
  findAll() {
    return this.depensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depensesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDepenseDto) {
    return this.depensesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.depensesService.remove(id);
  }
}
