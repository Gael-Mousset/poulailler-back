import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/database.providers';
import { Vente, VenteSchema } from './schemas/vente.schema';

export const VENTE_MODEL = 'VENTE_MODEL';

export const venteProviders = [
  {
    provide: VENTE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(Vente.name, VenteSchema),
    inject: [DATABASE_CONNECTION],
  },
];
