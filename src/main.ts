/**
 * main.ts
 * Autor: Leonardo Ayala
 *
 * Punto de entrada de la aplicación. Aquí se crea la app de Nest y se
 * registran los componentes GLOBALES (aplican a todas las rutas):
 *   - ValidationPipe       -> valida los DTO antes de llegar al controlador.
 *   - HttpExceptionFilter  -> da formato uniforme a todos los errores HTTP.
 *   - ResponseInterceptor  -> da formato uniforme a todas las respuestas exitosas.
 *
 * El Middleware se registra en app.module.ts y el Guard en el controlador,
 * porque esos dos solo deben aplicar a rutas específicas.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  // Crea la aplicación a partir del módulo raíz (AppModule).
  const app = await NestFactory.create(AppModule);

  // PIPE GLOBAL: valida automáticamente cualquier @Body() tipado con un DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // y si mandan propiedades extra, responde 400
      transform: true, // convierte el JSON plano en una instancia del DTO
    }),
  );

  // FILTRO GLOBAL: todos los errores HTTP salen con la misma estructura.
  app.useGlobalFilters(new HttpExceptionFilter());

  // INTERCEPTOR GLOBAL: todas las respuestas exitosas salen con { success, data, timestamp }.
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API de reservas corriendo en http://localhost:${port}`);
}

bootstrap();
