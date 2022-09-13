import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHello(res: Response): any{
    return res.status(200).json({
      id: 1,
      name: 'Van Tien',
      age: 22
    });
  }
}
