

# Debt Management API (NestJS + DDD)

API REST para la gestión de deudas entre amigos, implementada con NestJS y arquitectura DDD.


## Características principales

- Arquitectura DDD (Domain-Driven Design) pura
- Registro y autenticación de usuarios (JWT, password encriptado con bcryptjs)
- CRUD completo de deudas
- Marcar deudas como pagadas
- Listar deudas por usuario (pendientes y pagadas)
- Validaciones de dominio:
   - No se pueden registrar deudas con valores negativos
   - Una deuda pagada no puede ser modificada ni eliminada
- Endpoints de agregación (total de deudas pagadas, saldo pendiente)
- Exportar deudas (JSON/CSV)
- Documentación Swagger
- 100% de cobertura en pruebas unitarias (Jest)
- Listo para despliegue en Docker/Kubernetes
- Pruebas manuales vía cURL/Postman disponibles en `test/postman-curl.md`


## Estructura del proyecto

```
api/
├── src/
│   ├── application/
│   │   ├── debt/
│   │   │   ├── create-debt.use-case.ts
│   │   │   ├── debt.service.ts
│   │   │   └── pay-debt.use-case.ts
│   │   └── user/
│   │       ├── auth.service.ts
│   │       ├── create-user.use-case.ts
│   │       ├── login-user.use-case.ts
│   │       └── user.service.ts
│   ├── domain/
│   │   ├── debt/
│   │   │   ├── debt-repository.interface.ts
│   │   │   ├── debt-repository.token.ts
│   │   │   └── debt.entity.ts
│   │   └── user/
│   │       ├── user-repository.interface.ts
│   │       ├── user-repository.token.ts
│   │       └── user.entity.ts
│   ├── infrastructure/
│   │   ├── config/
│   │   │   ├── debt.module.ts
│   │   │   └── user.module.ts
│   │   ├── repositories/
│   │   │   ├── debt.repository.ts
│   │   │   └── user.repository.ts
│   │   └── web/
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts
│   │       │   ├── debt.controller.ts
│   │       │   └── user.controller.ts
│   │       ├── dto/
│   │       │   ├── create-debt.dto.ts
│   │       │   ├── create-user.dto.ts
│   │       │   ├── login-user.dto.ts
│   │       │   └── update-debt.dto.ts
│   │       └── guards/
│   │           └── jwt.strategy.ts
│   ├── app.module.ts
│   ├── data-source.ts
│   └── main.ts
├── test/
│   ├── *.spec.ts (pruebas unitarias)
│   └── postman-curl.md (colección cURL para pruebas manuales)
├── package.json
├── jest.config.js
├── Dockerfile
└── README.md
```

## Pruebas manuales con cURL/Postman

En la carpeta `test/postman-curl.md` encontrarás ejemplos de comandos cURL para probar los endpoints principales de la API (registro, login, crear deuda, listar deudas, pagar deuda). Puedes usarlos directamente o importarlos en Postman.


## Despliegue en Kubernetes (Minikube)

El despliegue de la API está completamente orientado a Kubernetes. No es necesario ejecutar la aplicación localmente: todo el ciclo de vida está pensado para ejecutarse en un clúster (por ejemplo, Minikube).

### Flujo de despliegue

1. **Construcción de la imagen Docker**

   Construye la imagen de la API:
   ```bash
   docker build -t debt-management-api:latest .
   ```
   Si usas Minikube, puedes cargar la imagen directamente:
   ```bash
   minikube image load debt-management-api:latest
   ```

2. **Manifiestos de Kubernetes**


   En la carpeta `deploy/` encontrarás los siguientes archivos YAML:

   - `deployment.yaml`: Define el Deployment de Kubernetes, es decir, cómo se ejecutan los pods de la API, la imagen a usar, variables de entorno y el número de réplicas.
   - `service.yaml`: Expone la API dentro del clúster (ClusterIP) y, opcionalmente, hacia fuera (NodePort). Permite que otros servicios o usuarios accedan a la API.
   - `configmap.yaml`: Contiene la configuración no sensible (por ejemplo, nombre de base de datos, host, puerto, etc). Se monta como variables de entorno en el contenedor.
   - `secret.yaml`: Almacena información sensible como secretos JWT o contraseñas de base de datos. Se monta como variables de entorno seguras.
   - `ingress.yaml`: Configura el acceso externo vía Ingress (por ejemplo, http://debt.local/api).
   - `postgres-secret.yaml`: Secret para la base de datos PostgreSQL.

   Cada manifiesto cumple una función específica y desacopla la configuración, los secretos y la definición de la aplicación, siguiendo buenas prácticas de Kubernetes.

3. **Despliegue de los recursos**


   Aplica todos los manifiestos en el orden que prefieras (Kubernetes resolverá dependencias automáticamente):
   ```bash
   kubectl apply -f deploy/configmap.yaml
   kubectl apply -f deploy/secret.yaml
   kubectl apply -f deploy/postgres-secret.yaml
   kubectl apply -f deploy/deployment.yaml
   kubectl apply -f deploy/service.yaml
   kubectl apply -f deploy/ingress.yaml
   ```


4. **Acceso a la API**

      - **Usando port-forward (recomendado para desarrollo/pruebas):**
         Puedes acceder a la API localmente usando port-forward de Kubernetes. Ejecuta:
         ```bash
         kubectl port-forward service/debt-management-api-service 8080:80
         ```
         Esto expondrá la API en `http://localhost:8080`.
      
         Ahora puedes probar los endpoints con Postman, cURL o navegador:
         ```bash
         curl http://localhost:8080/api/health
         ```

      - Si usas Minikube, puedes exponer el servicio con:
         ```bash
         minikube service debt-management-api-nodeport
         ```
      - O bien, consultar el NodePort y acceder desde tu navegador o Postman.
      - Si usas Ingress, asegúrate de tener el tunnel activo y la entrada en tu archivo hosts:
         ```bash
         minikube tunnel
         # y en C:\Windows\System32\drivers\etc\hosts
         # 127.0.0.1 debt.local
         ```


5. **Swagger**

   Una vez desplegada la API, accede a la documentación interactiva en `http://debt.local/api/docs`.

## Pruebas unitarias

Ejecuta las pruebas unitarias con:

```bash
npm run test
```

La cobertura es del 100% en todos los módulos principales.

---

**Desarrollado con NestJS, TypeORM, Jest, Docker y Kubernetes. Arquitectura DDD.**

