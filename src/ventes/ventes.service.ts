import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Vente, VenteDocument } from './schemas/vente.schema';
import { CreateVenteDto } from './dto/create-vente.dto';
import { UpdateVenteDto } from './dto/update-vente.dto';
import { VENTE_MODEL } from './ventes.providers';

@Injectable()
export class VentesService {
  constructor(
    @Inject(VENTE_MODEL)
    private venteModel: Model<VenteDocument>,
  ) {}

  async create(userId: string, dto: CreateVenteDto): Promise<Vente> {
    return this.venteModel.create({ ...dto, userId });
  }

  async findAll(userId: string): Promise<Vente[]> {
    return this.venteModel.find({ userId }).sort({ date: -1 }).exec();
  }

  async findOne(userId: string, id: string): Promise<Vente> {
    const doc = await this.venteModel.findOne({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Vente ${id} introuvable`);
    return doc;
  }

  async update(userId: string, id: string, dto: UpdateVenteDto): Promise<Vente> {
    const doc = await this.venteModel
      .findOneAndUpdate({ _id: id, userId }, { $set: dto }, { returnDocument: 'after' })
      .exec();
    if (!doc) throw new NotFoundException(`Vente ${id} introuvable`);
    return doc;
  }

  async remove(userId: string, id: string): Promise<void> {
    const doc = await this.venteModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Vente ${id} introuvable`);
  }
}
