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

  async create(dto: CreateVenteDto): Promise<Vente> {
    return this.venteModel.create(dto);
  }

  async findAll(): Promise<Vente[]> {
    return this.venteModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<Vente> {
    const doc = await this.venteModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Vente ${id} introuvable`);
    return doc;
  }

  async update(id: string, dto: UpdateVenteDto): Promise<Vente> {
    const doc = await this.venteModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Vente ${id} introuvable`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.venteModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException(`Vente ${id} introuvable`);
  }
}
