import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetCurrentUserId, Public } from '@common/decorators';
import { User } from './user.schema';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/my')
  public async getMy(@GetCurrentUserId() userId: string): Promise<User> {
    return await this.userService.getUserById(userId);
  }

  @Get('/search/:text')
  @HttpCode(HttpStatus.OK)
  public async searchUser(
    @GetCurrentUserId() userId: string,
    @Param('text') text: string,
  ): Promise<User[]> {
    return await this.userService.getUserWithFilter(userId, text);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @GetCurrentUserId() userId: string,
    @Body() userUpdateDto: Partial<UpdateUserDto>
  ): Promise<User> {
    return await this.userService.updateUser({ _id: userId }, userUpdateDto);
  }

  // @Public()
  // @Delete('/delete-all-users')
  // public async removeAllUsers(): Promise<any> {
  //   return await this.userService.removeAllUsers();
  // }
}
