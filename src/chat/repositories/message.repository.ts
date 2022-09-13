import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { MongodbRepository } from '@/database/mongodb/root-mongodb.repository';
import { Projection } from '@/common/types/utility.type';
import { User } from '@/user/user.schema';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MessageRepository extends MongodbRepository<Message> {
  constructor(
    @InjectModel(Message.name)
    protected chatMessageModel: Model<MessageDocument>,
  ) {
    super(chatMessageModel);
  }

  public async create(message: Message, options?: SaveOptions): Promise<Message> {
      const newMessage = new this.chatMessageModel(message);
      return await (await newMessage.save(options)).populate(['chat_room','sender']);
  }

  public async findOne(query: FilterQuery<Message>, projection?: Projection<Message>): Promise<Message> {
      return await this.chatMessageModel.findOne(query, projection).populate(['chat_room']);
  }

  public async findAll(
    query?: FilterQuery<Message>,
    projections?: Projection<Message>,
  ): Promise<Message[]> {
    return await this.chatMessageModel
      .find(query, { __v: 0, ...projections })
      .populate(['sender', 'seen']).populate({
        path: 'chat_room',
        populate: {
          path: 'participants',
          model: User.name
        }
      })
      .exec();
  }

  public async updateOne(
    query: FilterQuery<Message>,
    updateMessage: UpdateQuery<Message>,
    options?: QueryOptions<Message>,
  ): Promise<Message> {
    return await this.chatMessageModel
      .findOneAndUpdate(query, updateMessage, { new: true,...options})
      .populate([ 'sender','seen']).populate({
        path: 'chat_room',
        populate: {
          path: 'participants',
          model: User.name
        }
      })
      .exec();
  }
}
