import { SetMetadata } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const InRoom = SetMetadata('isPass', true);