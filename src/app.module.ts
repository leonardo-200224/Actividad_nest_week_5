/**
 * app.module.ts
 * Autor: Leonardo Ayala
 *
 * Módulo raíz. Importa el módulo de reservas y registra el Middleware.
 *
 * ¿Por qué el middleware se registra aquí y no con un decorador?
 * Porque en Nest los middlewares se configuran por rutas usando
 * MiddlewareConsumer dentro del método configure() de un módulo
 * que implementa la interfaz NestModule.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplico el LoggerMiddleware a TODAS las rutas del ReservationsController
    // (GET /reservations, POST /reservations, etc.).
    consumer.apply(LoggerMiddleware).forRoutes(ReservationsController);
  }
}
