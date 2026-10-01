/**
 * api-key.guard.ts
 * Autor: Leonardo Ayala
 *
 * GUARD (Lección 3)
 * Responde una sola pregunta: ¿esta petición tiene permiso de continuar?
 *
 * Regla: la petición debe traer el header  x-api-key: restaurant-secret
 *   - Si lo trae y es correcto  -> return true  -> la petición sigue.
 *   - Si no lo trae o es otro   -> return false -> Nest lanza automáticamente
 *                                  ForbiddenException (403) y el
 *                                  HttpExceptionFilter le da formato.
 *
 * ¿Por qué un Guard y no un Middleware?
 * Porque el Guard recibe el ExecutionContext y sabe qué controlador y qué
 * método se va a ejecutar. Así puedo proteger solo el POST y dejar el GET público.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

// Clave esperada. En un proyecto real iría en una variable de entorno (.env),
// nunca escrita en el código.
const API_KEY = 'restaurant-secret';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Obtengo la petición HTTP desde el contexto de ejecución.
    const request = context.switchToHttp().getRequest<Request>();

    // Node guarda los nombres de los headers en minúsculas,
    // por eso leo 'x-api-key' aunque el cliente envíe 'X-API-KEY'.
    const apiKey = request.headers['x-api-key'];

    // true = puede pasar | false = 403 Forbidden
    return apiKey === API_KEY;
  }
}
