# API de Reservas — Flujo de una petición en NestJS

**Autor:** Leonardo Ayala
**Actividad:** NestJS semana 5: Middleware, Exception Filters, Guards, Interceptors y Pipes

API para administrar las reservas de un restaurante. Cada componente de Nest
cumple una sola responsabilidad dentro del ciclo de vida de la petición.

---

## 1. Requisitos (Linux)

- Node.js 20 o superior
- npm (viene con Node)
- curl (para el script de pruebas; casi todas las distros lo traen)

Verificar:

```bash
node -v    # debe ser v20.x o mayor
npm -v
```

Si no tienes Node o tienes una versión vieja, la forma más simple es con **nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
```

---

## 2. Instalar y ejecutar

```bash
cd restaurant-api
npm install          # descarga las dependencias en node_modules/
npm run start:dev    # compila y arranca en modo desarrollo (se reinicia al guardar)
```

Si todo está bien, la consola muestra algo como:

```
[RoutesResolver] ReservationsController {/reservations}
[RouterExplorer] Mapped {/reservations, GET} route
[RouterExplorer] Mapped {/reservations/test-error, GET} route
[RouterExplorer] Mapped {/reservations, POST} route
[NestApplication] Nest application successfully started
API de reservas corriendo en http://localhost:3000
```

---

## 3. Probar los 6 casos de la actividad

Con el servidor corriendo, abre **otra terminal** en la carpeta del proyecto:

```bash
chmod +x pruebas.sh
./pruebas.sh
```

| # | Escenario | Resultado esperado | Componente |
|---|-----------|--------------------|------------|
| 1 | POST válido + API key correcta | 201, `success: true` | Todos |
| 2 | POST sin API key | 403 Forbidden | Guard |
| 3 | Email inválido / datos vacíos | 400 con mensajes de validación | Pipe |
| 4 | Excepción provocada (`/reservations/test-error`) | 400 con formato uniforme | Exception Filter |
| 5 | Petición normal | Log en la consola del servidor | Middleware |
| 6 | GET exitoso | Formato `success / data` | Interceptor |

También se puede probar con Postman, Insomnia o Bruno:

- **URL:** `http://localhost:3000/reservations`
- **Header:** `x-api-key: restaurant-secret` (solo para el POST)
- **Body → raw → JSON:**

```json
{
  "customerName": "Carlos Pérez",
  "email": "carlos@email.com",
  "people": 4
}
```

### Respuestas esperadas

Éxito (caso 1):

```json
{
  "success": true,
  "data": { "id": 1, "customerName": "Carlos Pérez", "email": "carlos@email.com", "people": 4 },
  "timestamp": "2026-10-01T15:35:42.123Z"
}
```

Error (caso 4):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Reservation data is invalid",
  "path": "/reservations/test-error",
  "timestamp": "2026-10-01T15:35:42.123Z"
}
```

Consola del servidor en el caso 1 (evidencia del orden del flujo):

```
[REQUEST] POST /reservations - 10:35:42      <- Middleware
[INTERCEPTOR] antes del controlador          <- Interceptor (antes)
[CONTROLLER] creando reserva                 <- Controller (el Pipe ya validó)
[INTERCEPTOR] después del controlador        <- Interceptor (después)
POST /reservations - 12ms (status 201)       <- Middleware (mini reto)
```

En el **caso 2** solo aparece el log del Middleware: el Guard corta la petición
antes del Interceptor. En el **caso 3** aparece "antes" pero no el Controller:
el Pipe rechazó los datos.

---

## 4. Estructura del proyecto

```
src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts   -> formato uniforme de errores
│   ├── guards/
│   │   └── api-key.guard.ts           -> exige x-api-key en el POST
│   ├── interceptors/
│   │   └── response.interceptor.ts    -> formato { success, data, timestamp }
│   └── middleware/
│       └── logger.middleware.ts       -> log de método, ruta, hora y tiempo
├── reservations/
│   ├── dto/
│   │   └── create-reservation.dto.ts  -> reglas de validación
│   ├── reservations.controller.ts     -> rutas GET y POST
│   ├── reservations.service.ts        -> lógica (reservas en memoria)
│   └── reservations.module.ts         -> agrupa controller + service
├── app.module.ts                      -> módulo raíz + registro del middleware
└── main.ts                            -> arranque + pipe, filtro e interceptor globales
```

---

## 5. Flujo de la petición

```
POST /reservations
   ↓
Middleware (logging)          logger.middleware.ts
   ↓
Guard (API Key)               api-key.guard.ts
   ↓
Interceptor (antes)           response.interceptor.ts
   ↓
Pipe (validación)             ValidationPipe + create-reservation.dto.ts
   ↓
Controller                    reservations.controller.ts
   ↓
Service                       reservations.service.ts
   ↓
Interceptor (después)         response.interceptor.ts
   ↓
Response

Error → Exception Filter (http-exception.filter.ts) → Error Response
```

### Dónde registré cada componente y por qué

| Componente | Dónde | Por qué |
|------------|-------|---------|
| Middleware | `app.module.ts` con `MiddlewareConsumer` | En Nest los middlewares se configuran por rutas dentro de un módulo |
| Exception Filter | Global en `main.ts` | Todos los errores de la app deben tener el mismo formato |
| Guard | `@UseGuards` en el método `POST` | Solo el POST se protege; el GET queda público (mini reto) |
| ValidationPipe | Global en `main.ts` | Cualquier DTO de la app se valida automáticamente |
| Interceptor | Global en `main.ts` | Todas las respuestas exitosas deben tener el mismo formato |

---

## 6. Pregunta de análisis

**¿Cuál es la diferencia entre lanzar una `BadRequestException` y crear un Exception Filter?**

Lanzar una `BadRequestException` es **avisar que algo salió mal**: se hace en
el lugar donde detecto el problema y dice qué pasó (el código 400 y el mensaje).
El Exception Filter es **el encargado de responder** a ese aviso: atrapa la
excepción y decide cómo se ve la respuesta que recibe el cliente. El `throw` se
escribe muchas veces, en cada lugar donde puede fallar algo; el filtro se escribe
una sola vez y garantiza que todos los errores tengan la misma estructura.

---

## 7. Problemas comunes

| Problema | Solución |
|----------|----------|
| `EADDRINUSE: address already in use :::3000` | Ya hay otra instancia corriendo. Ciérrala con Ctrl+C o ejecuta `fuser -k 3000/tcp`. También puedes usar otro puerto: `PORT=3001 npm run start:dev` |
| `nest: command not found` | Usa siempre `npm run start:dev`, que toma el CLI desde `node_modules` |
| `./pruebas.sh: Permission denied` | Ejecuta `chmod +x pruebas.sh` |
| Todas las respuestas del POST dan 403 | Revisa que el header sea exactamente `x-api-key: restaurant-secret` |
| Las reservas desaparecen | Es normal: se guardan en memoria y se pierden al reiniciar el servidor |
