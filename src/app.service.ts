import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class AppService {
	private createMeta(statusCode: number, message: string, errors: object[]) {
    return {
      code: statusCode,
      status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
      message: message,
      errors: errors || []
    };
  }

	responseSuccess(res: Response, statusCode: number, data: object | string | boolean | number) {
    const meta = this.createMeta(statusCode, '', []);

    res.status(statusCode).json({
      meta: meta,
      data: data
    });
  }
	
  responseError(res: Response, statusCode: number, message: string, errors: object[] = []) {
    const meta = this.createMeta(statusCode, message, errors);

    res.status(statusCode).json({
      meta: meta,
      data: null
    });
  }
}
