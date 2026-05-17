import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { depenseProviders } from './depenses.providers';
import { DepensesController } from './depenses.controller';
import { DepensesService } from './depenses.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DepensesController],
  providers: [...depenseProviders, DepensesService],
  exports: [DepensesService],
})
export class DepensesModule {}
