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

  async create(dto: CreateDepenseDto): Promise<Depense> {
    return this.depenseModel.create(dto);
  }

  async findAll(): Promise<Depense[]> {
    return this.depenseModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<Depense> {
    const doc = await this.depenseModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Dépense ${id} introuvable`);
    return doc;
  }

  async update(id: string, dto: UpdateDepenseDto): Promise<Depense> {
    const doc = await this.depenseModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Dépense ${id} introuvable`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.depenseModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException(`Dépense ${id} introuvable`);
  }
}
