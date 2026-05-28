import { Connection } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/database.providers';
import { User, UserSchema } from './schemas/user.schema';

export const USER_MODEL = 'USER_MODEL';

export const userProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(User.name, UserSchema),
    inject: [DATABASE_CONNECTION],
  },
];
