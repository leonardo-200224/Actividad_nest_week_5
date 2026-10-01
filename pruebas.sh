#!/usr/bin/env bash
# pruebas.sh
# Autor: Leonardo Ayala
#
# Ejecuta los 6 casos mínimos de prueba de la actividad usando curl.
# Uso (con el servidor corriendo en otra terminal):
#   chmod +x pruebas.sh
#   ./pruebas.sh
#
# Mientras corre, mira la terminal del servidor: ahí aparecen los logs del
# Middleware, del Interceptor y del Controller (evidencia del flujo).

URL="${URL:-http://localhost:3000}"
KEY="restaurant-secret"

titulo() {
  echo
  echo "=================================================================="
  echo " $1"
  echo "=================================================================="
}

titulo "CASO 1: POST válido + API Key correcta -> 201 success: true (Todos)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$URL/reservations" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $KEY" \
  -d '{"customerName":"Carlos Pérez","email":"carlos@email.com","people":4}'

titulo "CASO 2: POST sin API Key -> 403 Forbidden (Guard)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$URL/reservations" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Carlos Pérez","email":"carlos@email.com","people":4}'

titulo "CASO 3: Datos inválidos -> 400 error de validación (Pipe)"
curl -s -w "\nHTTP %{http_code}\n" -X POST "$URL/reservations" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $KEY" \
  -d '{"customerName":"","email":"esto-no-es-un-email","people":0}'

titulo "CASO 4: Excepción provocada -> 400 respuesta de error uniforme (Exception Filter)"
curl -s -w "\nHTTP %{http_code}\n" "$URL/reservations/test-error"

titulo "CASO 5: Petición normal -> log visible en la consola del servidor (Middleware)"
curl -s -o /dev/null -w "HTTP %{http_code}  (revisa la terminal del servidor)\n" "$URL/reservations"

titulo "CASO 6: GET público -> 200 formato success/data (Interceptor)"
curl -s -w "\nHTTP %{http_code}\n" "$URL/reservations"

echo
