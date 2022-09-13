import { ConfigCustomService } from '@/config/config.service';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    private fileInterceptor: NestInterceptor;
    constructor(configService: ConfigCustomService) {
      const filesDestination = configService.uploadFileDestination();

      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        //Customize file upload info in storage
        storage: diskStorage({
          destination,
          filename: (req, file, cb) => {
            const filename: string =
              Date.now().toString() +
              '-' +
              path.parse(file.originalname).name.replace(/\s/g, '');
            const extension: string = path.parse(file.originalname).ext;
            const fileUpload = `${filename}${extension}`;

            cb(null, fileUpload);
          },
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
