import { Injectable } from '@nestjs/common';
import {DataFactory, Seeder} from 'nestjs-seeder';
import { LoggerService } from '@/common/logger/logger.service';
import { UserRepoSitory } from '@user/user.repository';
import { User } from '@user/user.schema';

@Injectable()
export class UserSeeder implements Seeder {
    constructor(
        private readonly userRepository: UserRepoSitory,
        private readonly logger: LoggerService){}
    public seed(): Promise<any> {
        const users = DataFactory.createForClass(User).generate(2);
        this.logger.log(users);
        return this.userRepository.createMany(users);
    }

    public drop(): Promise<any> {
        return this.userRepository.deleteMany({});
    }
}