import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class CustomExceptionFilter<T extends InternalServerErrorException>
  implements ExceptionFilter
{
  public catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    return response.status(status).json({
      message: 'Something went wrong',
      statusCode: status,
    });
  }
}
