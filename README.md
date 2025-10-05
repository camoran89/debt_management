# Debt Management MVP

## Contexto del reto
Imagina que estás construyendo una aplicación para gestionar deudas entre amigos. Cada usuario puede registrar deudas, pagarlas y consultar el estado. El reto consiste en construir un MVP funcional con las siguientes condiciones:

## Backend (Node.js)
- Crear una API REST que permita:
  - Registrar usuarios (con email y password encriptado).
  - Crear, consultar, editar y eliminar deudas.
  - Marcar una deuda como pagada.
  - Listar las deudas de un usuario (pendientes y pagadas).

### Persistencia
- Usar PostgreSQL para almacenar usuarios y deudas.
- Implementar una capa de caché usando DynamoDB (AWS) o Redis (simulado si no tienes AWS).

### Validaciones obligatorias
- No se pueden registrar deudas con valores negativos.
- Una deuda pagada no puede ser modificada.

### Extra (para puntos extra)
- Endpoint para exportar deudas en JSON o CSV.
- Endpoint con agregaciones (ej: “total de deudas pagadas” o “saldo pendiente”).
- Test Unitarios.

## Frontend (React / Angular)
- Pantalla de Login/Registro.
- Pantalla de listado de deudas con filtros (pendientes/pagadas).
- Formulario para crear una nueva deuda.
- Vista de detalle de una deuda.
- UI moderna, minimalista y responsiva (no se evalúa diseño perfecto, sino organización y buenas prácticas).

## Restricciones y Retos
- El código debe estar en GitHub/GitLab, con commits progresivos (no todo en un solo commit).
- Deben incluir un README con instrucciones de despliegue local y explicación breve de las decisiones técnicas.
- Se evaluará la organización del repositorio, estructura de carpetas, convenciones de código y claridad de la documentación.

## Entrega esperada
- Repositorio en GitHub/GitLab con el código.
- README con instrucciones claras.

## Despliegue de bases de datos

Consulta las instrucciones en `databases/README.md` para desplegar PostgreSQL y Redis en Minikube.
