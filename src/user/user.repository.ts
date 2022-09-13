import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
} from 'mongoose';
import { MongodbRepository } from '@database/mongodb/root-mongodb.repository';
import { User, UserDocument } from './user.schema';
import { Projection } from '@/common/types/utility.type';

@Injectable()
export class UserRepoSitory extends MongodbRepository<User> {
  constructor(
    @InjectModel(User.name) protected userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  public async updateOne(
    userFilterQuery: FilterQuery<User>,
    updateUser: UpdateQuery<User>,
  ): Promise<User>;
  public async updateOne(
    userFilterQuery: FilterQuery<User>,
    updateUser: UpdateQuery<User>,
    options?: QueryOptions<User>,
  ): Promise<User>;
  public async updateOne(
    userFilterQuery: FilterQuery<User>,
    updateUser: UpdateQuery<User>,
    options?: QueryOptions<User>,
  ): Promise<User> {
    return await this.userModel
      .findOneAndUpdate(userFilterQuery, updateUser, options)
      .exec();
  }
}
