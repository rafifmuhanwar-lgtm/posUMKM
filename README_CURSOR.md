# Kasir UMKM — Quickstart untuk Cursor

## Cara Pakai dengan Cursor Agent

1. **Buka Cursor**, buat folder project baru
2. **Copy file `AGENTS.md`** ke root folder project
3. **Buka Cursor Composer** (Cmd/Ctrl + I → pilih Agent mode)
4. **Paste prompt ini** ke Cursor:

```
Baca file AGENTS.md di root project ini secara lengkap, 
lalu mulai dari FASE 1 — Project Scaffold.
Selesaikan semua task di Fase 1 dulu sebelum lanjut ke fase berikutnya.
Konfirmasi setiap task yang selesai dengan checklist.
```

5. Biarkan agent bekerja. Setelah Fase 1 selesai, lanjutkan dengan:

```
Fase 1 sudah selesai. Lanjutkan ke FASE 2 — Database & Backend Foundation.
```

## Setup Manual (setelah agent scaffold)

```bash
# Install semua dependency
npm install
cd apps/api && npm install
cd ../web && npm install

# Setup database
cp .env.example .env
# Edit .env dengan kredensial PostgreSQL kamu

# Jalankan migrasi
npm run db:migrate

# Isi data awal
npm run db:seed

# Jalankan dev server (frontend + backend bersamaan)
cd ../..
npm run dev
```

Frontend: http://localhost:5173
Backend:  http://localhost:3001
Prisma Studio: `npm run db:studio`

## Login Awal (dari seed)
- Email: `owner@kasirumkm.id`
- Password: `admin123`
- PIN Kasir: `1234`
