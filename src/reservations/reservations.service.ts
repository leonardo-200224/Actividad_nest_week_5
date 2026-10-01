import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

export interface Reservation {
  id: number;
  customerName: string;
  email: string;
  people: number;
}

@Injectable()
export class ReservationsService {
  // no hay base de datos, las reservas se guardan en este arreglo
  private reservations: Reservation[] = [];
  private nextId = 1;

  findAll() {
    return this.reservations;
  }

  create(dto: CreateReservationDto) {
    const reservation: Reservation = {
      id: this.nextId,
      customerName: dto.customerName,
      email: dto.email,
      people: dto.people,
    };
    this.nextId++;
    this.reservations.push(reservation);
    return reservation;
  }
}
