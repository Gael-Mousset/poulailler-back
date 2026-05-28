import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CATEGORY_MODEL } from './categories.providers';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_MODEL)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(userId: string, dto: CreateCategoryDto): Promise<{ id: string; name: string }> {
    const doc = await this.categoryModel
      .findOneAndUpdate(
        { userId, name: dto.name },
        { userId, name: dto.name },
        { upsert: true, new: true },
      )
      .exec();
    return { id: doc._id.toString(), name: doc.name };
  }

  async findAll(userId: string): Promise<{ id: string; name: string; global: boolean }[]> {
    const docs = await this.categoryModel
      .find({ $or: [{ userId }, { userId: null }] })
      .exec();
    return docs.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      global: c.userId === null,
    }));
  }

  async remove(userId: string, id: string): Promise<void> {
    const doc = await this.categoryModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Catégorie ${id} introuvable ou non supprimable`);
  }
}
