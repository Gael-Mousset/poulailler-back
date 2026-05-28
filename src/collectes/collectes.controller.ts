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
import { CollectesService } from './collectes.service';
import { CreateCollecteDto } from './dto/create-collecte.dto';
import { UpdateCollecteDto } from './dto/update-collecte.dto';

@UseGuards(JwtAuthGuard)
@Controller('collectes')
export class CollectesController {
  constructor(private readonly collectesService: CollectesService) {}

  @Post()
  upsert(@Request() req: { user: { userId: string } }, @Body() dto: CreateCollecteDto) {
    return this.collectesService.upsert(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.collectesService.findAll(req.user.userId);
  }

  @Get(':date')
  findOne(@Request() req: { user: { userId: string } }, @Param('date') date: string) {
    return this.collectesService.findOne(req.user.userId, date);
  }

  @Patch(':date')
  update(@Request() req: { user: { userId: string } }, @Param('date') date: string, @Body() dto: UpdateCollecteDto) {
    return this.collectesService.update(req.user.userId, date, dto);
  }

  @Delete(':date')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: { user: { userId: string } }, @Param('date') date: string) {
    return this.collectesService.remove(req.user.userId, date);
  }
}
