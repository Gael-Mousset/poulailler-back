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
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VentesService } from './ventes.service';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';

@UseGuards(JwtAuthGuard)
@Controller('ventes')
export class VentesController {
  constructor(private readonly ventesService: VentesService) {}

  @Post()
  create(@Request() req: { user: { userId: string } }, @Body() dto: CreateVenteDto) {
    return this.ventesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.ventesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ventesService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Request() req: { user: { userId: string } }, @Param('id') id: string, @Body() dto: UpdateVenteDto) {
    return this.ventesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ventesService.remove(req.user.userId, id);
  }
}
