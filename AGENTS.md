# AGENTS.md — Kasir UMKM App

> Baca file ini secara penuh sebelum menulis satu baris kode pun.
> Ini adalah sumber kebenaran tunggal untuk project ini.

---

## 🎯 Apa yang Dibangun

Aplikasi kasir (Point of Sale) berbasis web untuk warung makan UMKM Indonesia.
Satu codebase, bisa dikonfigurasi untuk berbagai jenis usaha: pecel ayam, mie ayam, warkop, warteg, dll.
Model bisnis: SaaS Rp 500/transaksi.

---

## 🏗️ Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Frontend | React 18 + Vite | latest |
| Styling | Tailwind CSS v3 | latest |
| State | Zustand | latest |
| Router | React Router v6 | latest |
| Backend | Node.js + Express | latest |
| ORM | Prisma | latest |
| Database | PostgreSQL | 15+ |
| Auth | JWT + bcryptjs | latest |
| Offline | Dexie.js (IndexedDB) | latest |
| Validasi | Zod | latest |
| HTTP Client | Axios | latest |
| Testing | Vitest + Supertest | latest |

---

## 📁 Struktur Folder yang Harus Dibuat

```
kasir-umkm/
├── AGENTS.md                  ← file ini
├── .env.example
├── .gitignore
├── README.md
│
├── apps/
│   ├── web/                   ← React frontend
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── package.json
│   │   └── src/
│   │       ├── main.jsx
│   │       ├── App.jsx
│   │       ├── index.css
│   │       │
│   │       ├── components/        ← komponen reusable
│   │       │   ├── ui/            ← atom: Button, Input, Badge, Modal, Toast
│   │       │   ├── layout/        ← AppShell, Sidebar, Header, BottomNav
│   │       │   └── shared/        ← ItemCard, CartItem, ReceiptPreview
│   │       │
│   │       ├── pages/
│   │       │   ├── auth/
│   │       │   │   ├── LoginPage.jsx
│   │       │   │   └── PinPage.jsx
│   │       │   ├── kasir/
│   │       │   │   ├── KasirPage.jsx       ← halaman utama POS
│   │       │   │   ├── PaymentModal.jsx
│   │       │   │   └── ReceiptModal.jsx
│   │       │   ├── menu/
│   │       │   │   ├── MenuPage.jsx
│   │       │   │   ├── MenuForm.jsx
│   │       │   │   └── KategoriPage.jsx
│   │       │   ├── laporan/
│   │       │   │   ├── LaporanPage.jsx
│   │       │   │   └── DetailTransaksi.jsx
│   │       │   ├── pengaturan/
│   │       │   │   ├── PengaturanPage.jsx  ← konfigurasi toko
│   │       │   │   └── TemplateToko.jsx
│   │       │   └── dashboard/
│   │       │       └── DashboardPage.jsx
│   │       │
│   │       ├── stores/            ← Zustand stores
│   │       │   ├── useCartStore.js
│   │       │   ├── useAuthStore.js
│   │       │   ├── useTokoStore.js
│   │       │   └── useMenuStore.js
│   │       │
│   │       ├── hooks/             ← custom React hooks
│   │       │   ├── useTransaksi.js
│   │       │   ├── useOfflineSync.js
│   │       │   └── usePrinter.js
│   │       │
│   │       ├── services/          ← API calls (Axios)
│   │       │   ├── api.js         ← Axios instance + interceptors
│   │       │   ├── auth.service.js
│   │       │   ├── menu.service.js
│   │       │   ├── transaksi.service.js
│   │       │   └── laporan.service.js
│   │       │
│   │       ├── db/                ← Dexie.js offline DB
│   │       │   └── offlineDb.js
│   │       │
│   │       └── utils/
│   │           ├── format.js      ← formatRupiah, formatTanggal
│   │           ├── struk.js       ← generate teks struk
│   │           └── constants.js
│   │
│   └── api/                   ← Express backend
│       ├── package.json
│       ├── server.js           ← entry point
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.js
│       └── src/
│           ├── config/
│           │   ├── db.js
│           │   └── env.js
│           ├── middleware/
│           │   ├── auth.middleware.js
│           │   ├── role.middleware.js
│           │   └── errorHandler.js
│           ├── routes/
│           │   ├── index.js
│           │   ├── auth.routes.js
│           │   ├── menu.routes.js
│           │   ├── transaksi.routes.js
│           │   ├── laporan.routes.js
│           │   └── toko.routes.js
│           ├── controllers/
│           │   ├── auth.controller.js
│           │   ├── menu.controller.js
│           │   ├── transaksi.controller.js
│           │   ├── laporan.controller.js
│           │   └── toko.controller.js
│           ├── services/
│           │   ├── auth.service.js
│           │   ├── transaksi.service.js
│           │   └── laporan.service.js
│           └── utils/
│               ├── response.js    ← helper standar { success, data, message }
│               └── jwt.js
```

---

## 🗄️ Database Schema (Prisma)

Buat `apps/api/prisma/schema.prisma` dengan model berikut:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Multi-tenant ──────────────────────────────────────────
model Toko {
  id              String   @id @default(cuid())
  nama            String
  alamat          String?
  telepon         String?
  logoUrl         String?
  jenisToko       String   @default("custom") // pecel_ayam | mie_ayam | warkop | warteg | custom
  warnaTema       String   @default("#1A5276")
  warnaAksen      String   @default("#F39C12")
  pajak           Float    @default(0)         // persentase, 0 = tidak ada pajak
  footerStruk     String?
  aktif           Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  users           User[]
  kategoris       Kategori[]
  menus           Menu[]
  transaksies     Transaksi[]
  shifts          Shift[]
}

model User {
  id          String   @id @default(cuid())
  tokoId      String
  nama        String
  email       String   @unique
  password    String
  pin         String?  // hash bcrypt 4-6 digit
  peran       Peran    @default(KASIR)
  aktif       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  toko        Toko        @relation(fields: [tokoId], references: [id])
  transaksies Transaksi[]
  shifts      Shift[]

  @@index([tokoId])
}

enum Peran {
  OWNER
  KASIR_SENIOR
  KASIR
}

model Kategori {
  id       String  @id @default(cuid())
  tokoId   String
  nama     String
  urutan   Int     @default(0)
  aktif    Boolean @default(true)

  toko     Toko   @relation(fields: [tokoId], references: [id])
  menus    Menu[]

  @@index([tokoId])
}

model Menu {
  id          String  @id @default(cuid())
  tokoId      String
  kategoriId  String
  nama        String
  harga       Int     // dalam Rupiah, tanpa desimal
  deskripsi   String?
  fotoUrl     String?
  tersedia    Boolean @default(true)
  urutan      Int     @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  toko            Toko           @relation(fields: [tokoId], references: [id])
  kategori        Kategori       @relation(fields: [kategoriId], references: [id])
  itemTransaksi   ItemTransaksi[]

  @@index([tokoId])
  @@index([kategoriId])
}

model Transaksi {
  id              String          @id @default(cuid())
  nomorStruk      String          // format: TRX-YYYYMMDD-XXXX
  tokoId          String
  userId          String
  shiftId         String?
  subtotal        Int
  diskon          Int             @default(0)
  pajak           Int             @default(0)
  total           Int
  metodeBayar     MetodeBayar
  nominalBayar    Int
  kembalian       Int             @default(0)
  catatan         String?
  status          StatusTransaksi @default(SELESAI)
  createdAt       DateTime        @default(now())

  toko            Toko            @relation(fields: [tokoId], references: [id])
  user            User            @relation(fields: [userId], references: [id])
  shift           Shift?          @relation(fields: [shiftId], references: [id])
  items           ItemTransaksi[]

  @@index([tokoId])
  @@index([createdAt])
}

enum MetodeBayar {
  TUNAI
  QRIS
  TRANSFER
  HUTANG
}

enum StatusTransaksi {
  SELESAI
  VOID
  HOLD
}

model ItemTransaksi {
  id          String @id @default(cuid())
  transaksiId String
  menuId      String
  namaMenu    String // snapshot saat transaksi
  hargaSatuan Int
  qty         Int
  subtotal    Int
  catatan     String?

  transaksi   Transaksi @relation(fields: [transaksiId], references: [id])
  menu        Menu      @relation(fields: [menuId], references: [id])

  @@index([transaksiId])
}

model Shift {
  id            String    @id @default(cuid())
  tokoId        String
  userId        String
  modalAwal     Int       @default(0)
  totalPenjualan Int      @default(0)
  jumlahTrx     Int       @default(0)
  kasAkhir      Int?
  selisih       Int?
  bukaAt        DateTime  @default(now())
  tutupAt       DateTime?
  catatan       String?

  toko          Toko        @relation(fields: [tokoId], references: [id])
  user          User        @relation(fields: [userId], references: [id])
  transaksies   Transaksi[]

  @@index([tokoId])
}
```

---

## 🔌 REST API Endpoints

Semua endpoint diawali `/api/v1`. Gunakan prefix `Authorization: Bearer <token>`.

### Auth
```
POST   /api/v1/auth/register        ← daftar toko baru + owner
POST   /api/v1/auth/login           ← login email+password, return JWT
POST   /api/v1/auth/pin             ← login kasir via PIN, return JWT pendek
POST   /api/v1/auth/refresh         ← refresh token
POST   /api/v1/auth/logout
```

### Toko (owner only)
```
GET    /api/v1/toko                 ← get profil toko
PUT    /api/v1/toko                 ← update konfigurasi toko
GET    /api/v1/toko/template/:jenis ← get default kategori per jenis toko
```

### Kategori
```
GET    /api/v1/kategori
POST   /api/v1/kategori
PUT    /api/v1/kategori/:id
DELETE /api/v1/kategori/:id
PATCH  /api/v1/kategori/:id/urutan
```

### Menu
```
GET    /api/v1/menu                 ← filter: ?kategoriId=&tersedia=true
POST   /api/v1/menu
PUT    /api/v1/menu/:id
DELETE /api/v1/menu/:id
PATCH  /api/v1/menu/:id/toggle      ← toggle tersedia/tidak
```

### Transaksi
```
GET    /api/v1/transaksi            ← filter: ?dari=&sampai=&status=
POST   /api/v1/transaksi            ← buat transaksi baru
GET    /api/v1/transaksi/:id
PATCH  /api/v1/transaksi/:id/void   ← void transaksi (kasir senior+)
```

### Laporan (owner only)
```
GET    /api/v1/laporan/harian       ← ?tanggal=YYYY-MM-DD
GET    /api/v1/laporan/ringkasan    ← ?dari=&sampai=
GET    /api/v1/laporan/item-terlaris ← ?dari=&sampai=&limit=10
GET    /api/v1/laporan/per-kasir    ← ?dari=&sampai=
```

### Shift
```
POST   /api/v1/shift/buka
POST   /api/v1/shift/tutup
GET    /api/v1/shift/aktif
```

### Format Response Standar
```json
{
  "success": true,
  "data": { ... },
  "message": "OK",
  "meta": { "page": 1, "total": 100 }
}
```

---

## 🖥️ Halaman & Komponen Utama

### KasirPage.jsx — layout split panel
```
┌─────────────────────────┬──────────────────┐
│  [Search] [Kategori...]  │  🛒 Keranjang    │
│                          │                  │
│  ┌──────┐ ┌──────┐       │  Ayam Goreng x2  │
│  │ foto │ │ foto │       │  Rp 30.000       │
│  │ nama │ │ nama │       │                  │
│  │ Rp   │ │ Rp   │       │  Nasi Putih x1   │
│  └──────┘ └──────┘       │  Rp 5.000        │
│                          │  ──────────────  │
│  ┌──────┐ ┌──────┐       │  Subtotal 35.000 │
│  │      │ │      │       │  Diskon  0       │
│  │      │ │      │       │  Total  35.000   │
│  └──────┘ └──────┘       │                  │
│                          │  [  BAYAR  ]     │
└─────────────────────────┴──────────────────┘
Mobile: toggle antara "Menu" dan "Keranjang"
```

### Zustand Stores

**useCartStore.js**
```js
// state: items[], diskon, metodeBayar
// actions: addItem, removeItem, updateQty, setDiskon, clearCart, setMetodeBayar
```

**useTokoStore.js**
```js
// state: profil toko (nama, logo, warna, jenis, pajak)
// actions: fetchProfil, updateProfil
```

**useAuthStore.js**
```js
// state: user, token, isAuthenticated
// actions: login, loginPin, logout, refreshToken
```

---

## ⚙️ Environment Variables

Buat `.env.example`:

```env
# Backend (apps/api)
DATABASE_URL="postgresql://user:password@localhost:5432/kasir_umkm"
JWT_SECRET="ganti-dengan-secret-yang-kuat-minimal-32-karakter"
JWT_EXPIRES_IN="7d"
JWT_PIN_EXPIRES_IN="8h"
PORT=3001
NODE_ENV="development"

# Frontend (apps/web)
VITE_API_URL="http://localhost:3001/api/v1"
VITE_APP_NAME="Kasir UMKM"
```

---

## 📦 package.json Scripts

### Root (monorepo sederhana)
```json
{
  "name": "kasir-umkm",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "cd apps/api && npm run dev",
    "dev:web": "cd apps/web && npm run dev",
    "build": "cd apps/web && npm run build",
    "db:migrate": "cd apps/api && npx prisma migrate dev",
    "db:seed": "cd apps/api && npx prisma db seed",
    "db:studio": "cd apps/api && npx prisma studio"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

---

## 🧱 Konvensi Kode

### Naming
- File komponen React: `PascalCase.jsx`
- File lain: `camelCase.js`
- CSS class: Tailwind utility, tidak ada custom CSS kecuali `index.css` untuk global
- Variabel: `camelCase`, konstanta: `UPPER_SNAKE_CASE`
- Endpoint: `kebab-case`

### Error Handling
- Frontend: semua error API ditangkap di Axios interceptor → tampilkan Toast
- Backend: semua error dilempar ke `errorHandler.js` middleware
- Gunakan HTTP status code yang benar: 200, 201, 400, 401, 403, 404, 422, 500

### Keuangan
- **Semua nilai harga/uang disimpan sebagai INTEGER (Rupiah, tanpa desimal)**
- Tidak pernah menggunakan `float` untuk kalkulasi harga
- Format tampilan menggunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`

### Keamanan
- Password: hash dengan bcrypt, salt rounds 12
- PIN: hash dengan bcrypt, salt rounds 10
- JWT: simpan di httpOnly cookie, bukan localStorage
- Semua route yang butuh auth: pasang `auth.middleware.js`
- Role check: pasang `role.middleware.js` dengan parameter peran minimum

---

## 🚀 Urutan Task untuk Agent

Jalankan task berikut **secara berurutan**, selesaikan satu sebelum lanjut ke berikutnya:

### FASE 1 — Project Scaffold
1. [ ] Buat struktur folder sesuai diagram di atas
2. [ ] Init `package.json` di root, `apps/web`, dan `apps/api`
3. [ ] Setup Vite + React + Tailwind di `apps/web`
4. [ ] Setup Express + Prisma di `apps/api`
5. [ ] Buat `.env.example` dan `.gitignore`
6. [ ] Buat `README.md` dengan instruksi setup

### FASE 2 — Database & Backend Foundation
7. [ ] Tulis `schema.prisma` lengkap sesuai spesifikasi
8. [ ] Buat `seed.js`: 1 toko contoh + 1 owner + kategori default + 5 menu contoh
9. [ ] Setup Express server dengan middleware: cors, helmet, morgan, express.json
10. [ ] Buat `errorHandler.js` dan `response.js` helper
11. [ ] Implementasi auth: register, login, refresh token
12. [ ] Implementasi auth middleware (JWT verify) dan role middleware

### FASE 3 — API Routes
13. [ ] CRUD routes: Toko, Kategori, Menu
14. [ ] Routes Transaksi: buat + void
15. [ ] Routes Laporan: harian, ringkasan, item terlaris
16. [ ] Routes Shift: buka, tutup, cek aktif

### FASE 4 — Frontend Foundation
17. [ ] Setup React Router: definisikan semua routes
18. [ ] Buat AppShell + Sidebar + BottomNav (mobile)
19. [ ] Buat komponen UI dasar: Button, Input, Badge, Modal, Toast
20. [ ] Setup Axios instance dengan interceptors (auth header + error handling)
21. [ ] Implementasi semua Zustand stores

### FASE 5 — Halaman Utama (MVP)
22. [ ] LoginPage + PinPage
23. [ ] KasirPage (layout split panel, grid menu, keranjang)
24. [ ] PaymentModal (pilih metode, input nominal, hitung kembalian)
25. [ ] ReceiptModal (preview struk, tombol cetak/WA)
26. [ ] MenuPage (daftar + toggle tersedia)
27. [ ] MenuForm (tambah/edit menu)
28. [ ] LaporanPage (ringkasan harian + tabel transaksi)
29. [ ] PengaturanPage (nama toko, logo, warna tema)

---

## ✅ Definition of Done per Task

Setiap task dianggap selesai jika:
- Kode berjalan tanpa error di development
- Tidak ada `console.log` yang tertinggal (kecuali di development logger)
- Komponen React tidak menggunakan inline style kecuali untuk dynamic value (misal warna tema dari store)
- Setiap API endpoint punya validasi input dengan Zod
- Response API selalu menggunakan format standar `{ success, data, message }`

---

## 🔗 Referensi Cepat

| Topik | Path |
|---|---|
| Database schema | `apps/api/prisma/schema.prisma` |
| API base URL | `VITE_API_URL` di `.env` |
| Zustand stores | `apps/web/src/stores/` |
| Komponen UI | `apps/web/src/components/ui/` |
| Format Rupiah | `apps/web/src/utils/format.js` → `formatRupiah()` |
| Seed data | `apps/api/prisma/seed.js` |

---

*File ini adalah panduan utama. Jika ada ambiguitas, tanya sebelum berasumsi.*
*Last updated: Juni 2025 | Stack: React 18 + Node.js + PostgreSQL*
