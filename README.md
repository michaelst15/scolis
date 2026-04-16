# MyBing.ai

Website dashboard untuk mengelola dan memantau workflow AI (Dokumen / Marketing / Support): membuat workflow, melihat proses/flow, memantau aktivitas, mengatur integrasi, dan mengelola pengaturan aplikasi.

## Struktur

- `frontend/` (React + Vite)
- `backend/` (Spring Boot)
- `docker-compose.yml` (PostgreSQL + backend + MailHog)

## Teknologi

- Frontend: React, Vite, Tailwind CSS, Lucide Icons
- Backend: Spring Boot (Web, Security, Validation, JPA), JWT, JavaMail
- Database: PostgreSQL (Docker)
- Email dev: MailHog (Docker) untuk menerima OTP email saat development

## Arsitektur Singkat

- Frontend berkomunikasi ke backend melalui REST API (`/api/...`)
- Backend menyimpan data user dan sesi di PostgreSQL
- OTP pendaftaran:
  - Frontend meminta OTP (`/api/auth/otp/request`) → backend mengirim ke email (via SMTP dev MailHog)
  - Frontend verifikasi OTP (`/api/auth/otp/verify`)
  - Register hanya bisa dilakukan jika OTP sudah valid (`/api/auth/register`)
- Single session:
  - Satu akun hanya boleh punya 1 sesi aktif (login kedua akan ditolak jika sesi masih aktif)

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default: `http://localhost:5173` (bisa berubah jika port sudah dipakai)

## Menjalankan Backend + Database (Docker)

```bash
docker compose up -d db mail
docker compose up -d --build backend
```

Backend: `http://localhost:8080/api/health`

MailHog (inbox email OTP dev): `http://localhost:8025`

## Port yang Dipakai

- Frontend: `5173` (atau port lain jika bentrok)
- Backend: `8080`
- PostgreSQL: `5433` (host) → `5432` (container)
- MailHog:
  - UI: `8025`
  - SMTP: `1025`

## Environment Variables

### Frontend

- `VITE_API_BASE_URL` (opsional)
  - Default: `http://localhost:8080`
  - Contoh: `VITE_API_BASE_URL=http://localhost:8080`

### Backend (docker-compose.yml)

- Database:
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/mybing`
  - `SPRING_DATASOURCE_USERNAME=mybing`
  - `SPRING_DATASOURCE_PASSWORD=mybing`
- CORS:
  - `CORS_ALLOWED_ORIGINS=http://localhost:*,http://127.0.0.1:*`
- JWT:
  - `JWT_SECRET` (wajib minimal 32 bytes)
  - `JWT_ISSUER` (default: `mybing.ai`)
  - `JWT_EXPIRES_MINUTES` (default: `240`)
- OTP:
  - `OTP_TTL_MINUTES` (default: `5`)
  - `OTP_RESEND_COOLDOWN_SECONDS` (default: `30`)
  - `OTP_MAX_ATTEMPTS` (default: `5`)
- Single session:
  - `SESSION_MAX_IDLE_MINUTES` (default: `2`)
- Email:
  - Dev (MailHog): `SPRING_MAIL_HOST=mail`, `SPRING_MAIL_PORT=1025`
  - Real SMTP (Gmail/Provider):
    - `SPRING_MAIL_HOST=smtp.gmail.com`
    - `SPRING_MAIL_PORT=587`
    - `SPRING_MAIL_USERNAME=<email>`
    - `SPRING_MAIL_PASSWORD=<app-password>`
    - `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true`
    - `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true`
    - `MAIL_FROM=<email-pengirim>`
    - `MAIL_FROM_NAME=MyBing.ai` (nama pengirim yang tampil di inbox)

## OTP Ke Email Asli (Gmail)

1. Copy `.env.example` menjadi `.env`
2. Isi nilai Gmail SMTP (gunakan **App Password**, bukan password login biasa)
3. Pastikan `.env` tidak dibagikan/di-commit (sudah di-ignore)
3. Restart backend:

```bash
docker compose up -d --build backend
```

4. Coba verifikasi lagi dari form Daftar

## Alur Aplikasi

### 1) Daftar + OTP

1. Masuk ke tab **Daftar**
2. Isi Email → klik **Verifikasi**
3. Cek email OTP:
   - Development: buka MailHog `http://localhost:8025`
4. Masukkan OTP 6 digit → klik **Cek OTP**
5. Setelah status terverifikasi, klik **Daftar**
6. Setelah sukses daftar, UI otomatis kembali ke tab **Masuk** (tidak auto-login)

### 2) Masuk

1. Isi email + password
2. Jika sukses, UI menyimpan token dan membuka Dashboard
3. Jika akun sedang aktif di perangkat lain, login ditolak (single session)

### 3) Single Session (1 akun = 1 sesi)

- Jika sesi masih aktif, login dari browser/perangkat lain akan ditolak dengan status `409`
- Logout akan memutus sesi di server (`POST /api/auth/logout`)

## Endpoint API (Ringkas)

- Health:
  - `GET /api/health` → `ok`
- OTP:
  - `POST /api/auth/otp/request` body: `{ "email": "..." }`
  - `POST /api/auth/otp/verify` body: `{ "email": "...", "code": "123456" }`
- Auth:
  - `POST /api/auth/register` body: `{ "fullName": "...", "email": "...", "password": "...", "otpCode": "123456" }`
  - `POST /api/auth/login` body: `{ "email": "...", "password": "..." }` → `{ accessToken, user }`
  - `POST /api/auth/logout` header: `Authorization: Bearer <token>`
  - `GET /api/me` header: `Authorization: Bearer <token>`

## Troubleshooting

- Backend tidak bisa diakses:
  - Pastikan container up: `docker compose ps`
  - Cek health: `curl http://localhost:8080/api/health`
  - Log backend: `docker compose logs backend --tail=200`
- OTP tidak masuk:
  - Pastikan mailhog up: `docker compose ps`
  - Buka MailHog UI: `http://localhost:8025`
- Port bentrok:
  - Frontend Vite akan auto pindah port
  - PostgreSQL project ini memakai host port `5433`
