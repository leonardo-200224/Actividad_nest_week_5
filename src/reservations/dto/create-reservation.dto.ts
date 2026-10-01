import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  email: string;

  // IsInt porque no se puede reservar para 2.5 personas
  @IsInt()
  @Min(1)
  people: number;
}
