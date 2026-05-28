import { Injectable, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { USER_MODEL } from './users.providers';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_MODEL) private userModel: Model<UserDocument>,
  ) {}

  async create(data: { email: string; passwordHash: string }): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    }).exec();
  }

  async setResetToken(id: Types.ObjectId, token: string, expiry: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { resetToken: token, resetTokenExpiry: expiry });
  }

  async updatePassword(id: Types.ObjectId, passwordHash: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }
}
