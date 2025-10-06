# Debt Management API - Postman cURL Collection

## Endpoints

### 1. Crear usuario
```
curl -X POST http://debt.local/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass"
  }'
```

### 2. Login usuario
```
curl -X POST http://debt.local/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass"
  }'
```

### 3. Crear deuda (requiere JWT)
```
curl -X POST http://debt.local/api/debts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "amount": 1000,
    "description": "Prueba de deuda"
  }'
```

### 4. Listar deudas (requiere JWT)
```
curl -X GET http://debt.local/api/debts \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 5. Pagar deuda (requiere JWT)
```
curl -X POST http://debt.local/api/debts/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "debtId": 1
  }'
```

> Reemplaza `<JWT_TOKEN>` por el token obtenido en el login.
