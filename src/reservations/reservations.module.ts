/**
 * reservations.module.ts
 * Autor: Leonardo Ayala
 *
 * MODULE
 * Agrupa todo lo relacionado con reservas: su controlador y su servicio.
 * Si el servicio no estuviera en "providers", Nest no podría inyectarlo
 * en el controlador y la app no arrancaría.
 */
import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
