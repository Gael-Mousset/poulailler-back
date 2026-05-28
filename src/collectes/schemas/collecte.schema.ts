import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollecteDocument = HydratedDocument<Collecte>;

@Schema({ timestamps: true })
export class Collecte {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, min: 0 })
  count!: number;
}

export const CollecteSchema = SchemaFactory.createForClass(Collecte);
CollecteSchema.index({ userId: 1, date: 1 }, { unique: true });
