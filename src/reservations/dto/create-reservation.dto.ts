/**
 * create-reservation.dto.ts
 * Autor: Leonardo Ayala
 *
 * DTO (Data Transfer Object) + PIPES (Lección 3)
 * Define la "forma" que deben tener los datos para crear una reserva y las
 * reglas que deben cumplir. El ValidationPipe (registrado en main.ts) lee
 * estos decoradores y valida el body ANTES de que se ejecute el controlador.
 *
 * ¿Por qué es una CLASE y no una INTERFACE?
 * Porque las interfaces desaparecen al compilar TypeScript a JavaScript.
 * En tiempo de ejecución no existen y no pueden tener decoradores, así que
 * el ValidationPipe no tendría nada que validar.
 */
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  // Nombre obligatorio: debe ser texto y no puede venir vacío ("").
  @IsString({ message: 'customerName debe ser un texto' })
  @IsNotEmpty({ message: 'customerName es obligatorio' })
  customerName: string;

  // Email con formato válido (ej: carlos@email.com).
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  email: string;

  // Número entero (no se reserva para 2.5 personas) y mínimo 1.
  @IsInt({ message: 'people debe ser un número entero' })
  @Min(1, { message: 'people debe ser mínimo 1' })
  people: number;
}
