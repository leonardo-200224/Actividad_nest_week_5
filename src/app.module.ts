import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ReservationsController } from './reservations/reservations.controller';

@Module({
  imports: [ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // el middleware se aplica solo a las rutas de reservas
    consumer.apply(LoggerMiddleware).forRoutes(ReservationsController);
  }
}
