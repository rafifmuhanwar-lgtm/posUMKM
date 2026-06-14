const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getHarian = async (tokoId, tanggal) => {
  const dateObj = new Date(tanggal);
  const nextDate = new Date(dateObj);
  nextDate.setDate(nextDate.getDate() + 1);

  return prisma.transaksi.findMany({
    where: {
      tokoId,
      status: 'SELESAI',
      createdAt: {
        gte: dateObj,
        lt: nextDate,
      },
    },
  });
};

const getRingkasan = async (tokoId, dari, sampai) => {
  const dateDari = new Date(dari);
  const dateSampai = new Date(sampai);
  dateSampai.setHours(23, 59, 59, 999);

  const aggr = await prisma.transaksi.aggregate({
    _sum: { total: true },
    _count: { id: true },
    where: {
      tokoId,
      status: 'SELESAI',
      createdAt: {
        gte: dateDari,
        lte: dateSampai,
      },
    },
  });

  return {
    totalPendapatan: aggr._sum.total || 0,
    jumlahTransaksi: aggr._count.id || 0,
  };
};

const getItemTerlaris = async (tokoId, dari, sampai, limit = 10) => {
  const dateDari = new Date(dari);
  const dateSampai = new Date(sampai);
  dateSampai.setHours(23, 59, 59, 999);

  // Prisma doesn't support grouping deeply efficiently out of the box for related sums easily
  // Let's use groupBy on ItemTransaksi
  const items = await prisma.itemTransaksi.groupBy({
    by: ['menuId', 'namaMenu'],
    _sum: {
      qty: true,
      subtotal: true,
    },
    where: {
      transaksi: {
        tokoId,
        status: 'SELESAI',
        createdAt: {
          gte: dateDari,
          lte: dateSampai,
        },
      },
    },
    orderBy: {
      _sum: { qty: 'desc' },
    },
    take: parseInt(limit),
  });

  return items.map((i) => ({
    menuId: i.menuId,
    namaMenu: i.namaMenu,
    terjual: i._sum.qty || 0,
    pendapatan: i._sum.subtotal || 0,
  }));
};

const getPerKasir = async (tokoId, dari, sampai) => {
  const dateDari = new Date(dari);
  const dateSampai = new Date(sampai);
  dateSampai.setHours(23, 59, 59, 999);

  const transactions = await prisma.transaksi.groupBy({
    by: ['userId'],
    _sum: { total: true },
    _count: { id: true },
    where: {
      tokoId,
      status: 'SELESAI',
      createdAt: {
        gte: dateDari,
        lte: dateSampai,
      },
    },
  });

  const users = await prisma.user.findMany({ where: { tokoId } });
  
  return transactions.map((t) => {
    const user = users.find((u) => u.id === t.userId);
    return {
      userId: t.userId,
      namaKasir: user ? user.nama : 'Unknown',
      totalPendapatan: t._sum.total || 0,
      jumlahTransaksi: t._count.id || 0,
    };
  });
};

module.exports = {
  getHarian,
  getRingkasan,
  getItemTerlaris,
  getPerKasir,
};
