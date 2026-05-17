import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/database.providers';
import { Category, CategorySchema } from './schemas/category.schema';

export const CATEGORY_MODEL = 'CATEGORY_MODEL';

export const categoryProviders = [
  {
    provide: CATEGORY_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(Category.name, CategorySchema),
    inject: [DATABASE_CONNECTION],
  },
];
