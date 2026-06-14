# Kasir UMKM App

Aplikasi kasir (Point of Sale) berbasis web untuk warung makan UMKM Indonesia.

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Zustand
- Backend: Node.js, Express, Prisma, PostgreSQL

## Setup Project

1. Clone repository
2. Jalankan `npm install` di root directory.
3. Masuk ke `apps/api` dan jalankan `npm install`.
4. Masuk ke `apps/web` dan jalankan `npm install`.
5. Copy `.env.example` ke `.env` di root atau di masing-masing app dan sesuaikan konfigurasi database.
6. Jalankan migrasi database: `npm run db:migrate` (di root).
7. Seed database: `npm run db:seed`.
8. Jalankan development server: `npm run dev` (di root).
