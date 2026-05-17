import * as mongoose from 'mongoose';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<mongoose.Connection> => {
      await mongoose.connect(
        process.env.MONGODB_URI ?? 'mongodb://localhost:27017/poulailler',
      );
      return mongoose.connection;
    },
  },
];
