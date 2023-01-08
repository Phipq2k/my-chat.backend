import { Projection } from '@/common/types/utility.type';
import {
  Document,
  FilterQuery,
  InsertManyOptions,
  Model,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
} from 'mongoose';
export abstract class MongodbRepository<T> {
  constructor(protected readonly entityModel: Model<T & Document>) {}

  public async findOne(
    query: FilterQuery<T>,
    projections?: Projection<T>,
  ): Promise<T> {
    return await this.entityModel.findOne(query, projections).exec();
  }

  public async findAll(
    query?: FilterQuery<T>,
    projections?: Projection<T>,
  ): Promise<T[]> {
    return await this.entityModel.find(query,projections).exec();
  }


  public async create(entityData: T, options?: SaveOptions): Promise<T> {
    const entity = new this.entityModel(entityData);
    return await entity.save(options);
  }

  public async createMany(
    createEntitiesData: Record<string, unknown>[],
    options?: InsertManyOptions,
  ): Promise<T[]> {
    return await this.entityModel.insertMany(createEntitiesData, options);
  }

  public async updateOne(
    query: FilterQuery<T>,
    updateEntityData: UpdateQuery<T & Document>,
    options?: QueryOptions<T>,
  ): Promise<T> {
    return await this.entityModel.findOneAndUpdate(
      query,
      updateEntityData,
      options,
    );
  }

  public async deleteOne(entityFilterQuery: FilterQuery<T>): Promise<void> {
    await this.entityModel.deleteOne(entityFilterQuery);
  }

  public async deleteMany(entityFilterQuery?: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
