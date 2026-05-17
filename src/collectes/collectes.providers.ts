import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/database.providers';
import { Collecte, CollecteSchema } from './schemas/collecte.schema';

export const COLLECTE_MODEL = 'COLLECTE_MODEL';

export const collecteProviders = [
  {
    provide: COLLECTE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(Collecte.name, CollecteSchema),
    inject: [DATABASE_CONNECTION],
  },
];
