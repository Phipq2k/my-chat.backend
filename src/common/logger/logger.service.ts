import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
    error(message: any, stack?: string, context?: string): void;
    error(message: any, ...optionalParams: any[]): void;
    error(message: any, stack?: any, context?: any): void {
        super.error(message, stack, context);
    }

    warn(message: any, context?: string): void;
    warn(message: any, ...optionalParams: any[]): void;
    warn(message: any, context?: any): void {
        super.warn(message, context);
    }

    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: any[]): void;
    log(message: any, context?: any): void {
        super.log(message,context);
    }

    debug(message: any, context?: string): void;
    debug(message: any, ...optionalParams: any[]): void;
    debug(message: any, context?: any): void {
        super.debug(message,context);
    }

    verbose(message: any, context?: string): void;
    verbose(message: any, ...optionalParams: any[]): void;
    verbose(message: any, context?: any): void {
        super.verbose(message,context);
    }
}