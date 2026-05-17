import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { collecteProviders } from './collectes.providers';
import { CollectesController } from './collectes.controller';
import { CollectesService } from './collectes.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CollectesController],
  providers: [...collecteProviders, CollectesService],
  exports: [CollectesService],
})
export class CollectesModule {}
