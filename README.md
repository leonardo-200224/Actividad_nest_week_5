# API de reservas - NestJS

Actividad de la semana 5. Es una API para hacer reservas en un restaurante. La usé para practicar el flujo de una petición en NestJS: middleware, exception filter, guard, pipe e interceptor.

## Cómo correrlo

1. Instalar las dependencias:

```
npm install
```

2. Arrancar el servidor:

```
npm run start:dev
```

3. La API queda en `http://localhost:3000/reservations`.

4. Para probarla, en Postman importé el archivo `Reservas.postman_collection.json` (Import → elegir el archivo).

## Endpoints

- `GET /reservations` → lista las reservas. Es público.
- `POST /reservations` → crea una reserva. Necesita el header `x-api-key: restaurant-secret`.

Ejemplo del body del POST:

```json
{
  "customerName": "Carlos Pérez",
  "email": "carlos@email.com",
  "people": 4
}
```

## Lo que hice paso a paso

### 1. Crear el proyecto

```
nest new restaurant-api
npm i class-validator class-transformer
nest g module reservations
nest g controller reservations --no-spec
nest g service reservations --no-spec
```

En el service guardo las reservas en un arreglo porque no hay base de datos. Por eso se borran cuando se reinicia el servidor.

### 2. Middleware

Archivo: `src/common/middleware/logger.middleware.ts`

Muestra en la consola cada petición que llega, con el método, la ruta y la hora:

```
[REQUEST] POST /reservations - 10:35:42
```

Para el mini reto, cuando termina la respuesta muestra cuánto se demoró:

```
POST /reservations - 12ms
```

Lo registré en `app.module.ts` con `MiddlewareConsumer`, solo para las rutas de reservas.

### 3. Exception filter

Archivo: `src/common/filters/http-exception.filter.ts`

Hace que todos los errores salgan con el mismo formato:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Reservation data is invalid",
  "path": "/reservations",
  "timestamp": "..."
}
```

Lo registré global en `main.ts`. Para probarlo puse un rato `throw new BadRequestException('Reservation data is invalid');` en el POST del controller y después lo quité.

### 4. Guard

Archivo: `src/common/guards/api-key.guard.ts`

Revisa que la petición traiga el header `x-api-key: restaurant-secret`. Si no lo trae o está mal, responde 403.

Lo puse con `@UseGuards` solo en el POST, así el GET sigue siendo público (mini reto).

### 5. Pipe (validación)

Archivo: `src/reservations/dto/create-reservation.dto.ts`

Reglas:

- `customerName`: obligatorio
- `email`: tiene que ser un email válido
- `people`: número entero, mínimo 1

Activé el `ValidationPipe` en `main.ts`. Si los datos están mal responde 400 con la lista de errores y el controller no se ejecuta.

### 6. Interceptor

Archivo: `src/common/interceptors/response.interceptor.ts`

Hace que las respuestas que salen bien tengan este formato:

```json
{
  "success": true,
  "data": { "id": 1, "customerName": "Carlos Pérez", "email": "carlos@email.com", "people": 4 },
  "timestamp": "..."
}
```

El `timestamp` es el mini reto. También lo registré global en `main.ts`.

## Pruebas

Las hice en Postman (están en `Reservas.postman_collection.json`):

1. POST con datos bien y con API key → 201 y `success: true`
2. POST sin API key → 403
3. POST con datos mal (nombre vacío, email inválido, 0 personas) → 400 con los errores
4. Error provocado con el `throw` → 400 con el formato del filter
5. Cualquier petición → sale el log en la consola
6. GET /reservations → `success: true` y la lista en `data`

Así se ve la consola con un POST que sale bien:

```
[REQUEST] POST /reservations - 10:35:42
[Interceptor] antes
[Interceptor] después
POST /reservations - 12ms
```

Ahí se ve el orden: primero el middleware, después el guard, el interceptor (antes), el pipe, el controller y otra vez el interceptor (después). Cuando no mando la API key solo salen los logs del middleware, porque el guard corta la petición antes.

## Pregunta de análisis

**¿Qué diferencia hay entre lanzar un BadRequestException y crear un Exception Filter?**

El `BadRequestException` se lanza en el lugar donde pasa el error y dice qué salió mal. El exception filter es el que recibe ese error y decide cómo se le muestra al cliente. El throw se puede poner en muchas partes, pero el filter se hace una sola vez y así todos los errores salen con el mismo formato.
