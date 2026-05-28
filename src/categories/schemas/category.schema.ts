import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ type: String, default: null })
  userId!: string | null;

  @Prop({ required: true })
  name!: string;
}


export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });
