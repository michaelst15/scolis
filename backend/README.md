# Backend (Spring Boot)

## Menjalankan (Docker)

1. Pastikan Docker Desktop/Engine sudah running.
2. Dari root project:

```bash
docker compose up -d db
docker compose up -d --build backend
```

Backend akan tersedia di `http://localhost:8080`.

## Endpoint

- `GET /api/health` → `ok`
- `POST /api/auth/register`
  - body: `{ "fullName": "...", "email": "...", "password": "...", "otpCode": "123456" }`
- `POST /api/auth/login`
  - body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/otp/request`
  - body: `{ "email": "..." }`
- `POST /api/auth/otp/verify`
  - body: `{ "email": "...", "code": "123456" }`
- `GET /api/me` (butuh header `Authorization: Bearer <token>`)

## Role

- Jika email daftar = `admin@gmail.com` maka role `ADMIN`
- Selain itu otomatis role `USER`

## Catatan Register

- Register tidak otomatis login. Setelah daftar, lakukan login untuk mendapatkan token.
- Register hanya bisa dilakukan jika email sudah diverifikasi dengan OTP.
