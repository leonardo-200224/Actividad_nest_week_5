/**
 * reservations.controller.ts
 * Autor: Leonardo Ayala
 *
 * CONTROLLER
 * Recibe las peticiones HTTP y DELEGA al servicio. No tiene lógica de negocio.
 *
 * Rutas:
 *   GET  /reservations             -> público, lista las reservas
 *   POST /reservations             -> protegido con ApiKeyGuard, crea una reserva
 *   GET  /reservations/test-error  -> solo para probar el Exception Filter (caso 4)
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation, ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  // Nest inyecta el servicio automáticamente por el constructor.
  // Yo nunca hago "new ReservationsService()".
  constructor(private readonly reservationsService: ReservationsService) {}

  // GET /reservations -> PÚBLICO (no tiene Guard).
  @Get()
  findAll(): Reservation[] {
    return this.reservationsService.findAll();
  }

  // GET /reservations/test-error -> provoca una excepción a propósito para
  // comprobar que el HttpExceptionFilter responde con el formato uniforme.
  @Get('test-error')
  testError(): never {
    throw new BadRequestException('Reservation data is invalid');
  }

  // POST /reservations -> PROTEGIDO.
  // Mini reto del Guard: pongo @UseGuards en el MÉTODO y no en la clase,
  // así solo el POST exige la API key y el GET sigue siendo público.
  //
  // @Body() dto: CreateReservationDto -> el ValidationPipe valida el body
  // con las reglas del DTO. Si falla, responde 400 y este método NUNCA se ejecuta.
  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() dto: CreateReservationDto): Reservation {
    console.log('[CONTROLLER] creando reserva');
    return this.reservationsService.create(dto);
  }
}
