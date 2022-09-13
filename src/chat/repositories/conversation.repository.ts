import { Projection } from '@/common/types/utility.type';
import { MongodbRepository } from '@/database/mongodb/root-mongodb.repository';
import { User } from '@/user/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import {Conversation, ConversationDocument } from '../schemas/conversation.schema';

@Injectable()
export class ConversationRepository extends MongodbRepository<Conversation> {
  constructor(
    @InjectModel(Conversation.name)
    protected conversationModel: Model<ConversationDocument>,
  ) {
    super(conversationModel);
  }

  public async findOne(
    roomFilterQuery: FilterQuery<Conversation>,
    projection?: Projection<Conversation>,
  ): Promise<Conversation> {
    return await this.conversationModel
      .findOne(roomFilterQuery, projection)
      .populate(['participants']);
  }

  public async findAll(query?: FilterQuery<Conversation>, projection?: Projection<Conversation>): Promise<Conversation[]>{
    return await this.conversationModel.find(query, projection).populate(['participants']).sort({updatedAt: 'desc'});
  }
  

  public async updateOne(
    query: FilterQuery<Conversation>,
    updateRoom: UpdateQuery<Partial<Conversation>>,
  ): Promise<Conversation> {
    return await this.conversationModel
      .findOneAndUpdate(query, updateRoom, { new: true })
      .populate(['participants'])
      .exec();
  }
}
