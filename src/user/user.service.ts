import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { FilterQuery } from 'mongoose';
import { UserRepoSitory } from './user.repository';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepoSitory) {}

  public async getUserById(userId: string): Promise<User> {
    return await this.userRepository.findOne({ _id: userId });
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  public async getUser(userFilterQuery: FilterQuery<User>): Promise<User> {
    return await this.userRepository.findOne(userFilterQuery);
  }

  public async getUserWithFilter(userId: string, text: string): Promise<User[]>{
    let users: User[] = await this.getAllUsers();

    if (text) {
      users = users.filter(
        (user) =>
          (user.user_name.includes(text) || user.user_email.includes(text)) &&
          user._id.toString() !== userId,
      );
    }
    return users;
  }

  public async addUser(user: User): Promise<User> {
    const { user_avatar, ...userDto } = user;
    const newUser = await this.userRepository.create({
      user_avatar: '',
      ...userDto,
    });
    return newUser;
  }

  public async updateUser(
    userFilterQuery: FilterQuery<User>,
    data: Partial<User>,
  ): Promise<User> {
    return await this.userRepository.updateOne(userFilterQuery, data);
  }

  public async uploadAvatarUser(userId: string, avatar: string): Promise<User> {
    try {
      const user = await this.getUserById(userId);
      const avatarPath = `src/assets/avatar/${user.user_avatar}`;
      if (user.user_avatar) fs.unlinkSync(avatarPath);

      return await this.updateUser({ _id: userId }, { user_avatar: avatar });
    } catch (err) {
      await this.updateUser({ _id: userId }, { user_avatar: avatar });
    }
  }

  // public async removeAllUsers(): Promise<any> {
  //   return await this.userRepository.deleteMany();
  // }
}
