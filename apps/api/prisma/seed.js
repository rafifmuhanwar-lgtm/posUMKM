const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hapus data lama (optional, comment jika tidak perlu)
  // await prisma.itemTransaksi.deleteMany();
  // await prisma.transaksi.deleteMany();
  // await prisma.menu.deleteMany();
  // await prisma.kategori.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.toko.deleteMany();

  // 1. Buat Toko
  const toko = await prisma.toko.create({
    data: {
      nama: 'Warteg Sederhana',
      alamat: 'Jl. Merdeka No. 45, Jakarta',
      telepon: '081234567890',
      jenisToko: 'warteg',
      pajak: 0,
    },
  });

  // 2. Buat User (Owner)
  const passwordHash = await bcrypt.hash('password123', 12);
  const pinHash = await bcrypt.hash('1234', 10);
  
  const owner = await prisma.user.create({
    data: {
      tokoId: toko.id,
      nama: 'Budi Owner',
      email: 'owner@warteg.com',
      password: passwordHash,
      pin: pinHash,
      peran: 'OWNER',
    },
  });

  // 3. Buat Kategori
  const katMakanan = await prisma.kategori.create({
    data: {
      tokoId: toko.id,
      nama: 'Makanan',
      urutan: 1,
    },
  });

  const katMinuman = await prisma.kategori.create({
    data: {
      tokoId: toko.id,
      nama: 'Minuman',
      urutan: 2,
    },
  });

  // 4. Buat Menu
  const menus = [
    {
      tokoId: toko.id,
      kategoriId: katMakanan.id,
      nama: 'Nasi Putih',
      harga: 5000,
      urutan: 1,
    },
    {
      tokoId: toko.id,
      kategoriId: katMakanan.id,
      nama: 'Ayam Goreng',
      harga: 15000,
      urutan: 2,
    },
    {
      tokoId: toko.id,
      kategoriId: katMakanan.id,
      nama: 'Telur Dadar',
      harga: 5000,
      urutan: 3,
    },
    {
      tokoId: toko.id,
      kategoriId: katMinuman.id,
      nama: 'Es Teh Manis',
      harga: 4000,
      urutan: 1,
    },
    {
      tokoId: toko.id,
      kategoriId: katMinuman.id,
      nama: 'Kopi Hitam',
      harga: 5000,
      urutan: 2,
    },
  ];

  for (const menu of menus) {
    await prisma.menu.create({ data: menu });
  }

  console.log('Seeding selesai!');
  console.log('---');
  console.log(`Toko: ${toko.nama}`);
  console.log(`Email Login: owner@warteg.com`);
  console.log(`Password Login: password123`);
  console.log(`PIN Kasir: 1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
