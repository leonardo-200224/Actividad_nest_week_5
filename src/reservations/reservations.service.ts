/**
 * reservations.service.ts
 * Autor: Leonardo Ayala
 *
 * SERVICE
 * Contiene la lógica de negocio. No sabe nada de HTTP (no usa req ni res).
 * Las reservas se guardan en memoria (un arreglo), por eso se pierden
 * cuando se reinicia el servidor. En un proyecto real se usaría una base de datos.
 */
import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

// Estructura de una reserva ya guardada (incluye el id).
export interface Reservation {
  id: number;
  customerName: string;
  email: string;
  people: number;
}

// @Injectable() permite que Nest cree este servicio y lo inyecte
// en el controlador (inyección de dependencias).
@Injectable()
export class ReservationsService {
  private reservations: Reservation[] = [];
  private nextId = 1;

  // Devuelve todas las reservas.
  findAll(): Reservation[] {
    return this.reservations;
  }

  // Crea una reserva nueva con un id autoincremental.
  create(dto: CreateReservationDto): Reservation {
    const reservation: Reservation = {
      id: this.nextId++,
      customerName: dto.customerName,
      email: dto.email,
      people: dto.people,
    };
    this.reservations.push(reservation);
    return reservation;
  }
}
