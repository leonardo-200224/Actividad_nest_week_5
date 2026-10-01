/**
 * logger.middleware.ts
 * Autor: Leonardo Ayala
 *
 * MIDDLEWARE (Lección 1)
 * Es la PRIMERA capa del flujo. Observa la petición antes de que llegue
 * al Guard, al Pipe o al Controller.
 *
 * Qué hace:
 *   1. Cuando llega la petición imprime:  [REQUEST] POST /reservations - 10:35:42
 *   2. Mini reto: cuando la respuesta termina imprime cuánto tardó:
 *                                         POST /reservations - 12ms
 *
 * Como es la primera capa, registra TODAS las peticiones, incluso las que
 * después el Guard rechaza con 403.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
// Ojo: Request, Response y NextFunction se importan de 'express',
// NO de '@nestjs/common' (allí "Request" es un decorador, no un tipo).
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Guardo el momento exacto en que llegó la petición (en milisegundos).
    const inicio = Date.now();

    // Hora de llegada en formato HH:mm:ss (ej: 10:35:42).
    const hora = new Date().toTimeString().slice(0, 8);

    // originalUrl conserva la ruta completa (/reservations).
    console.log(`[REQUEST] ${req.method} ${req.originalUrl} - ${hora}`);

    // MINI RETO: medir el tiempo de la petición.
    // No sirve medir justo después de next(), porque next() no espera a que
    // el controlador termine. Por eso escucho el evento 'finish', que se
    // dispara cuando la respuesta ya se envió al cliente.
    res.on('finish', () => {
      const duracion = Date.now() - inicio;
      console.log(
        `${req.method} ${req.originalUrl} - ${duracion}ms (status ${res.statusCode})`,
      );
    });

    // Dejo que la petición continúe. Si no llamo next(), la petición
    // se queda "colgada" y el cliente nunca recibe respuesta.
    next();
  }
}
