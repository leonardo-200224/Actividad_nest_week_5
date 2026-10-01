import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // aqui viene el mensaje del error
    // (si el error es del ValidationPipe el mensaje es una lista)
    const error = exception.getResponse() as { message: string | string[] };

    response.status(status).json({
      success: false,
      statusCode: status,
      message: error.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
