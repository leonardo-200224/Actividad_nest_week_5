import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  // el guard solo esta en el POST, asi el GET queda publico
  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }
}
