import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepenseDocument = HydratedDocument<Depense>;

@Schema({ timestamps: true })
export class Depense {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  amount!: number;
}

export const DepenseSchema = SchemaFactory.createForClass(Depense);
