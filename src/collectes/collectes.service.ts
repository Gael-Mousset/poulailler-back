import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Collecte, CollecteDocument } from './schemas/collecte.schema';
import { CreateCollecteDto } from './dto/create-collecte.dto';
import { UpdateCollecteDto } from './dto/update-collecte.dto';
import { COLLECTE_MODEL } from './collectes.providers';

@Injectable()
export class CollectesService {
  constructor(
    @Inject(COLLECTE_MODEL)
    private collecteModel: Model<CollecteDocument>,
  ) {}

  async upsert(dto: CreateCollecteDto): Promise<Collecte> {
    return this.collecteModel
      .findOneAndUpdate(
        { date: dto.date },
        { count: dto.count },
        { upsert: true, new: true },
      )
      .exec();
  }

  async findAll(): Promise<Record<string, number>> {
    const docs = await this.collecteModel.find().exec();
    return docs.reduce(
      (acc, c) => ({ ...acc, [c.date]: c.count }),
      {} as Record<string, number>,
    );
  }

  async findOne(date: string): Promise<Collecte | null> {
    return this.collecteModel.findOne({ date }).exec();
  }

  async update(date: string, dto: UpdateCollecteDto): Promise<Collecte | null> {
    return this.collecteModel
      .findOneAndUpdate({ date }, { $set: dto }, { new: true })
      .exec();
  }

  async remove(date: string): Promise<void> {
    await this.collecteModel.deleteOne({ date }).exec();
  }
}
