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
import { CollectesService } from './collectes.service';
import { CreateCollecteDto } from './dto/create-collecte.dto';
import { UpdateCollecteDto } from './dto/update-collecte.dto';

@Controller('collectes')
export class CollectesController {
  constructor(private readonly collectesService: CollectesService) {}

  @Post()
  upsert(@Body() dto: CreateCollecteDto) {
    return this.collectesService.upsert(dto);
  }

  @Get()
  findAll() {
    return this.collectesService.findAll();
  }

  @Get(':date')
  findOne(@Param('date') date: string) {
    return this.collectesService.findOne(date);
  }

  @Patch(':date')
  update(@Param('date') date: string, @Body() dto: UpdateCollecteDto) {
    return this.collectesService.update(date, dto);
  }

  @Delete(':date')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('date') date: string) {
    return this.collectesService.remove(date);
  }
}
