import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VenteDocument = HydratedDocument<Vente>;

@Schema({ timestamps: true })
export class Vente {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, min: 1 })
  oeufs!: number;

  @Prop({ required: true, min: 0 })
  montant!: number;
}

export const VenteSchema = SchemaFactory.createForClass(Vente);
