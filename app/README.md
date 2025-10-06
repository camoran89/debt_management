
# Debt Management Frontend (Angular)

## Cómo abrir el frontend

Puedes abrir la aplicación de dos formas:

### 1. Modo desarrollo local (recomendado para desarrollo)

Ejecuta el servidor de Angular directamente:

```bash
npm run start
# o
ng serve
```
Luego abre tu navegador en: http://localhost:4200

### 2. Usando port-forward de Kubernetes (ideal para pruebas sobre el clúster)

Si tienes desplegado el frontend en Kubernetes, puedes exponerlo localmente con:

```bash
kubectl port-forward service/debt-management-frontend-service 8081:80
```
Luego abre tu navegador en: http://localhost:8081

---

Frontend moderno para la gestión de deudas entre amigos, construido con Angular 16 y Angular Material.

## Características

- **Arquitectura moderna**: Componentes standalone, rutas lazy-loading
- **UI/UX**: Angular Material con diseño responsivo y minimalista
- **Funcionalidades**:
  - Pantalla de Login/Registro con validación
  - Listado de deudas con filtros (pendientes/pagadas)
  - Formulario para crear/editar deudas
  - Vista de detalle de deuda con acciones
  - Navegación fluida entre pantallas
- **Pruebas**: Pruebas unitarias para todos los componentes
- **Producción**: Listo para despliegue en Docker/Kubernetes

## Estructura del proyecto

```
app/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.scss
│   │   │   │   └── login.component.spec.ts
│   │   │   ├── debt-list/
│   │   │   │   ├── debt-list.component.ts
│   │   │   │   ├── debt-list.component.html
│   │   │   │   ├── debt-list.component.scss
│   │   │   │   └── debt-list.component.spec.ts
│   │   │   ├── debt-form/
│   │   │   │   └── ... (similar structure)
│   │   │   └── debt-detail/
│   │   │       └── ... (similar structure)
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── debt.service.ts
│   │   │   └── debt.service.spec.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   └── ...
├── deploy/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── Dockerfile
├── nginx.conf
└── README.md
```

## Desarrollo local

### Prerrequisitos
- Node.js 18+
- Angular CLI 16+

### Instalación
```bash
npm install
```

### Servidor de desarrollo
```bash
npm start
# o
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias algún archivo.

### Pruebas unitarias
```bash
npm test
# o
ng test
```

### Build de producción
```bash
npm run build
# o
ng build --configuration production
```

## Despliegue en Kubernetes

### 1. Construir la imagen Docker
```bash
docker build -t debt-management-frontend:latest .
```

### 2. Cargar imagen en Minikube (si usas Minikube)
```bash
minikube image load debt-management-frontend:latest
```

### 3. Aplicar manifiestos de Kubernetes
```bash
kubectl apply -f deploy/deployment.yaml
kubectl apply -f deploy/service.yaml
kubectl apply -f deploy/ingress.yaml
```

### 4. Configurar acceso (Minikube)
- Agregar a `C:\Windows\System32\drivers\etc\hosts`:
  ```
  127.0.0.1 debt-app.local
  ```
- Ejecutar el tunnel:
  ```bash
  minikube tunnel
  ```

### 5. Acceder a la aplicación
Abre tu navegador en: `http://debt-app.local`

## Arquitectura

### Componentes Standalone
Todos los componentes son standalone, lo que permite:
- Carga lazy de módulos
- Mejor tree-shaking
- Arquitectura más modular

### Servicios
- **AuthService**: Manejo de autenticación, JWT, y estado de usuario
- **DebtService**: Operaciones CRUD de deudas con la API backend

### Rutas
- `/login` - Pantalla de login/registro
- `/debts` - Listado principal de deudas
- `/debt-form` - Crear nueva deuda
- `/debt-form/:id` - Editar deuda existente
- `/debt-detail/:id` - Ver detalle de deuda

### Angular Material Components
- MatCard, MatButton, MatFormField, MatInput
- MatSelect, MatChips, MatProgressSpinner
- MatToolbar, MatIcon

## API Integration

El frontend se conecta a la API backend en:
- **Desarrollo**: `http://localhost:3000/api`
- **Producción**: `http://debt.local/api`

### Endpoints utilizados
- `POST /auth/login` - Autenticación
- `POST /users/register` - Registro de usuarios
- `GET /debts` - Listar deudas del usuario
- `POST /debts` - Crear nueva deuda
- `GET /debts/:id` - Obtener deuda específica
- `PATCH /debts/:id` - Actualizar deuda
- `PATCH /debts/:id/pay` - Marcar deuda como pagada
- `DELETE /debts/:id` - Eliminar deuda

## Tecnologías utilizadas

- **Angular 16**: Framework principal
- **Angular Material 16**: Componentes de UI
- **TypeScript**: Lenguaje de desarrollo
- **RxJS**: Programación reactiva
- **SCSS**: Preprocesador CSS
- **Jasmine & Karma**: Testing framework
- **Docker**: Containerización
- **Nginx**: Servidor web de producción
- **Kubernetes**: Orquestación de contenedores

---

**Desarrollado con Angular 16, Angular Material y buenas prácticas de desarrollo moderno.**
