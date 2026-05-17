import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CATEGORY_MODEL } from './categories.providers';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_MODEL)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<{ id: string; name: string }> {
    const doc = await this.categoryModel
      .findOneAndUpdate(
        { name: dto.name },
        { name: dto.name },
        { upsert: true, new: true },
      )
      .exec();
    return { id: doc._id.toString(), name: doc.name };
  }

  async findAll(): Promise<{ id: string; name: string }[]> {
    const docs = await this.categoryModel.find().exec();
    return docs.map((c) => ({ id: c._id.toString(), name: c.name }));
  }

  async remove(id: string): Promise<void> {
    const doc = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException(`Catégorie ${id} introuvable`);
  }
}
