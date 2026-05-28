import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Depense, DepenseDocument } from './schemas/depense.schema';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { UpdateDepenseDto } from './dto/update-depense.dto';
import { DEPENSE_MODEL } from './depenses.providers';

@Injectable()
export class DepensesService {
  constructor(
    @Inject(DEPENSE_MODEL)
    private depenseModel: Model<DepenseDocument>,
  ) {}

  async create(userId: string, dto: CreateDepenseDto): Promise<Depense> {
    return this.depenseModel.create({ ...dto, userId });
  }

  async findAll(userId: string): Promise<Depense[]> {
    return this.depenseModel.find({ userId }).sort({ date: -1 }).exec();
  }

  async findOne(userId: string, id: string): Promise<Depense> {
    const doc = await this.depenseModel.findOne({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Dépense ${id} introuvable`);
    return doc;
  }

  async update(userId: string, id: string, dto: UpdateDepenseDto): Promise<Depense> {
    const doc = await this.depenseModel
      .findOneAndUpdate({ _id: id, userId }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Dépense ${id} introuvable`);
    return doc;
  }

  async remove(userId: string, id: string): Promise<void> {
    const doc = await this.depenseModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Dépense ${id} introuvable`);
  }
}
