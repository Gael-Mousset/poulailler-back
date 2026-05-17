import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { venteProviders } from './ventes.providers';
import { VentesController } from './ventes.controller';
import { VentesService } from './ventes.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VentesController],
  providers: [...venteProviders, VentesService],
  exports: [VentesService],
})
export class VentesModule {}
