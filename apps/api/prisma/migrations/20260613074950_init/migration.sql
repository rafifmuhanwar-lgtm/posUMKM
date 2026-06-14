-- CreateEnum
CREATE TYPE "Peran" AS ENUM ('OWNER', 'KASIR_SENIOR', 'KASIR');

-- CreateEnum
CREATE TYPE "MetodeBayar" AS ENUM ('TUNAI', 'QRIS', 'TRANSFER', 'HUTANG');

-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('SELESAI', 'VOID', 'HOLD');

-- CreateTable
CREATE TABLE "Toko" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "telepon" TEXT,
    "logoUrl" TEXT,
    "jenisToko" TEXT NOT NULL DEFAULT 'custom',
    "warnaTema" TEXT NOT NULL DEFAULT '#1A5276',
    "warnaAksen" TEXT NOT NULL DEFAULT '#F39C12',
    "pajak" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "footerStruk" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Toko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT,
    "peran" "Peran" NOT NULL DEFAULT 'KASIR',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "kategoriId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "fotoUrl" TEXT,
    "tersedia" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" TEXT NOT NULL,
    "nomorStruk" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftId" TEXT,
    "subtotal" INTEGER NOT NULL,
    "diskon" INTEGER NOT NULL DEFAULT 0,
    "pajak" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "metodeBayar" "MetodeBayar" NOT NULL,
    "nominalBayar" INTEGER NOT NULL,
    "kembalian" INTEGER NOT NULL DEFAULT 0,
    "catatan" TEXT,
    "status" "StatusTransaksi" NOT NULL DEFAULT 'SELESAI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTransaksi" (
    "id" TEXT NOT NULL,
    "transaksiId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "namaMenu" TEXT NOT NULL,
    "hargaSatuan" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "ItemTransaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modalAwal" INTEGER NOT NULL DEFAULT 0,
    "totalPenjualan" INTEGER NOT NULL DEFAULT 0,
    "jumlahTrx" INTEGER NOT NULL DEFAULT 0,
    "kasAkhir" INTEGER,
    "selisih" INTEGER,
    "bukaAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutupAt" TIMESTAMP(3),
    "catatan" TEXT,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tokoId_idx" ON "User"("tokoId");

-- CreateIndex
CREATE INDEX "Kategori_tokoId_idx" ON "Kategori"("tokoId");

-- CreateIndex
CREATE INDEX "Menu_tokoId_idx" ON "Menu"("tokoId");

-- CreateIndex
CREATE INDEX "Menu_kategoriId_idx" ON "Menu"("kategoriId");

-- CreateIndex
CREATE INDEX "Transaksi_tokoId_idx" ON "Transaksi"("tokoId");

-- CreateIndex
CREATE INDEX "Transaksi_createdAt_idx" ON "Transaksi"("createdAt");

-- CreateIndex
CREATE INDEX "ItemTransaksi_transaksiId_idx" ON "ItemTransaksi"("transaksiId");

-- CreateIndex
CREATE INDEX "Shift_tokoId_idx" ON "Shift"("tokoId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "Toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kategori" ADD CONSTRAINT "Kategori_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "Toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "Toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "Toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTransaksi" ADD CONSTRAINT "ItemTransaksi_transaksiId_fkey" FOREIGN KEY ("transaksiId") REFERENCES "Transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTransaksi" ADD CONSTRAINT "ItemTransaksi_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "Toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
