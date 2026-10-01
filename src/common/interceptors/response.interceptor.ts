/**
 * response.interceptor.ts
 * Autor: Leonardo Ayala
 *
 * INTERCEPTOR (Lección 3)
 * Envuelve la ejecución del controlador. Tiene dos partes:
 *   - ANTES:   el código que va antes de next.handle()
 *   - DESPUÉS: lo que va dentro de .pipe(...), cuando el controlador ya respondió
 *
 * Por eso en el diagrama del flujo aparece dos veces, pero es el MISMO método.
 *
 * Qué hace: transforma toda respuesta exitosa a:
 * {
 *   "success": true,
 *   "data": { ...lo que devolvió el controlador... },
 *   "timestamp": "..."      <- mini reto
 * }
 *
 * Si ocurre un error, map() NO se ejecuta: el error va directo al
 * HttpExceptionFilter. Por eso un error nunca sale con success: true.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // ---- ANTES ----
    // Aquí todavía no se ha ejecutado ni el Pipe ni el Controller.
    console.log('[INTERCEPTOR] antes del controlador');

    // next.handle() ejecuta el resto del flujo (Pipe -> Controller -> Service)
    // y devuelve un Observable con lo que retornó el controlador.
    return next.handle().pipe(
      // ---- DESPUÉS ----
      // tap(): hace algo sin modificar la respuesta (aquí solo un log).
      tap(() => console.log('[INTERCEPTOR] después del controlador')),

      // map(): transforma la respuesta antes de enviarla al cliente.
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(), // mini reto
      })),
    );
  }
}
