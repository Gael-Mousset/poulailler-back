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

  async upsert(userId: string, dto: CreateCollecteDto): Promise<Collecte> {
    return this.collecteModel
      .findOneAndUpdate(
        { userId, date: dto.date },
        { $set: { count: dto.count } },
        { upsert: true, returnDocument: 'after' },
      )
      .exec();
  }

  async findAll(userId: string): Promise<Record<string, number>> {
    const docs = await this.collecteModel.find({ userId }).exec();
    return docs.reduce(
      (acc, c) => ({ ...acc, [c.date]: c.count }),
      {} as Record<string, number>,
    );
  }

  async findOne(userId: string, date: string): Promise<Collecte | null> {
    return this.collecteModel.findOne({ userId, date }).exec();
  }

  async update(userId: string, date: string, dto: UpdateCollecteDto): Promise<Collecte | null> {
    return this.collecteModel
      .findOneAndUpdate({ userId, date }, { $set: dto }, { returnDocument: 'after' })
      .exec();
  }

  async remove(userId: string, date: string): Promise<void> {
    await this.collecteModel.deleteOne({ userId, date }).exec();
  }
}
