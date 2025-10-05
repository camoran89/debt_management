# Despliegue de PostgreSQL y Redis en Minikube

Este directorio contiene los manifiestos de Kubernetes para desplegar las bases de datos necesarias del sistema:

- **postgres-deployment.yaml**: 
  - Crea un PersistentVolumeClaim para almacenamiento persistente de datos.
  - Despliega un Deployment de PostgreSQL con la imagen oficial (`postgres:15`).
  - Configura las variables de entorno para el nombre de la base de datos (`debt_management`), usuario (`admin`) y contraseña (`admin123`).
  - Monta el almacenamiento persistente en el contenedor.
  - Expone el servicio PostgreSQL en el puerto 5432 dentro del clúster.

- **redis-deployment.yaml**: 
  - Despliega un Deployment de Redis usando la imagen oficial (`redis:7`).
  - Expone el servicio Redis en el puerto 6379 dentro del clúster.

## Instrucciones de despliegue

Sigue estos pasos para desplegar las bases de datos en tu entorno local usando Minikube:

1. Asegúrate de tener Minikube y kubectl instalados y funcionando.
2. Inicia Minikube:

```powershell
minikube start
```

3. Aplica los manifiestos de Kubernetes para PostgreSQL y Redis:

```powershell
kubectl apply -f databases/postgres-deployment.yaml
kubectl apply -f databases/redis-deployment.yaml
```

4. Verifica que los pods y servicios estén corriendo:

```powershell
kubectl get pods
kubectl get svc
```

Esto desplegará PostgreSQL (usuario: admin, password: admin123, base de datos: debt_management) y Redis en tu clúster local de Minikube.

## Cadenas de conexión

### PostgreSQL
- **Host:** postgres
- **Puerto:** 5432
- **Base de datos:** debt_management
- **Usuario:** admin
- **Contraseña:** admin123
- **Cadena de conexión ejemplo:**
  - PostgreSQL URI: `postgresql://admin:admin123@postgres:5432/debt_management`

### Redis
- **Host:** redis
- **Puerto:** 6379
- **Cadena de conexión ejemplo:**
  - Redis URI: `redis://redis:6379`

> Estas cadenas de conexión funcionan dentro del clúster de Kubernetes. Si necesitas acceder desde fuera del clúster, deberás exponer los servicios o usar port-forwarding.

## Acceso externo mediante port-forward

Si necesitas acceder a PostgreSQL o Redis desde tu máquina local (fuera del clúster), puedes usar port-forward con los siguientes comandos en una terminal:

### PostgreSQL
```powershell
kubectl port-forward svc/postgres 5432:5432
```
Esto expondrá PostgreSQL en tu máquina local en el puerto 5432.

### Redis
```powershell
kubectl port-forward svc/redis 6379:6379
```
Esto expondrá Redis en tu máquina local en el puerto 6379.

Mientras estos comandos estén activos, podrás conectarte usando las cadenas de conexión:
- PostgreSQL: `postgresql://admin:admin123@localhost:5432/debt_management`
- Redis: `redis://localhost:6379`
