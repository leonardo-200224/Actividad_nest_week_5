/**
 * http-exception.filter.ts
 * Autor: Leonardo Ayala
 *
 * EXCEPTION FILTER (Lección 2)
 * Es la "salida de emergencia" del flujo. Si cualquier capa lanza una
 * HttpException (Guard -> 403, Pipe -> 400, Controller -> throw ...),
 * la petición sale del flujo normal y llega aquí.
 *
 * Su trabajo es decidir CÓMO se ve la respuesta de error, para que todas
 * tengan la misma estructura:
 * {
 *   "success": false,
 *   "statusCode": 400,
 *   "message": "Invalid data",
 *   "path": "/reservations",
 *   "timestamp": "..."
 * }
 *
 * Diferencia con lanzar un BadRequestException:
 *   - El throw dice QUÉ salió mal (se escribe donde ocurre el problema).
 *   - El filtro define CÓMO se le responde al cliente (se escribe una sola vez).
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch(HttpException) = este filtro atrapa HttpException y todas sus
// "hijas": BadRequestException, ForbiddenException, NotFoundException, etc.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    // ArgumentsHost es genérico (sirve para HTTP, WebSockets, etc.).
    // Con switchToHttp() le digo que estoy trabajando con HTTP.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Código de estado de la excepción (400, 403, 404...).
    const statusCode = exception.getStatus();

    // getResponse() puede devolver:
    //   - un string  -> cuando hago throw new BadRequestException('texto')... a veces
    //   - un objeto  -> { statusCode, message, error }
    // Y cuando el error viene del ValidationPipe, "message" es un ARREGLO
    // con un mensaje por cada regla que falló.
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string | string[] }).message ??
          exception.message;

    // Respondo con la estructura uniforme.
    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
