import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/database.providers';
import { Depense, DepenseSchema } from './schemas/depense.schema';

export const DEPENSE_MODEL = 'DEPENSE_MODEL';

export const depenseProviders = [
  {
    provide: DEPENSE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(Depense.name, DepenseSchema),
    inject: [DATABASE_CONNECTION],
  },
];
