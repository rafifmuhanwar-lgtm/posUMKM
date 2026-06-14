const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTransaksi = async (tokoId, filters = {}) => {
  const where = { tokoId, poinDibayar: true };
  if (filters.status) where.status = filters.status;
  if (filters.dari && filters.sampai) {
    where.createdAt = {
      gte: new Date(filters.dari),
      lte: new Date(filters.sampai),
    };
  }

  return prisma.transaksi.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { nama: true } },
    },
  });
};

const getTransaksiById = async (id, tokoId) => {
  const transaksi = await prisma.transaksi.findUnique({
    where: { id, tokoId },
    include: {
      items: true,
      user: { select: { nama: true } },
    },
  });
  if (!transaksi) throw { statusCode: 404, message: 'Transaksi not found' };
  return transaksi;
};

const createTransaksi = async (tokoId, userId, data) => {
  // Generate nomorStruk TRX-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await prisma.transaksi.count({
    where: {
      tokoId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });
  const nomorStruk = `TRX-${dateStr}-${String(countToday + 1).padStart(4, '0')}`;

  return prisma.$transaction(async (tx) => {
    // Cek saldo poin Toko
    const toko = await tx.toko.findUnique({
      where: { id: tokoId },
      select: { saldoPoin: true }
    });

    const isPoinCukup = toko.saldoPoin > 0;

    // 1. Create Transaksi
    const transaksi = await tx.transaksi.create({
      data: {
        tokoId,
        userId,
        shiftId: data.shiftId,
        nomorStruk,
        subtotal: data.subtotal,
        diskon: data.diskon || 0,
        pajak: data.pajak || 0,
        total: data.total,
        metodeBayar: data.metodeBayar,
        nominalBayar: data.nominalBayar,
        kembalian: data.kembalian || 0,
        catatan: data.catatan,
        status: data.status || 'SELESAI',
        poinDibayar: isPoinCukup,
      },
    });

    // 2. Create Items
    const items = data.items.map((item) => ({
      transaksiId: transaksi.id,
      menuId: item.menuId,
      namaMenu: item.namaMenu,
      hargaSatuan: item.hargaSatuan,
      qty: item.qty,
      subtotal: item.subtotal,
      catatan: item.catatan,
    }));

    await tx.itemTransaksi.createMany({
      data: items,
    });

    // 3. Update Poin & Shift if Poin Cukup
    if (isPoinCukup) {
      await tx.toko.update({
        where: { id: tokoId },
        data: { saldoPoin: { decrement: 1 } }
      });

      if (data.shiftId && data.status !== 'HOLD') {
        await tx.shift.update({
          where: { id: data.shiftId },
          data: {
            totalPenjualan: { increment: data.total },
            jumlahTrx: { increment: 1 },
          },
        });
      }
    }

    return tx.transaksi.findUnique({
      where: { id: transaksi.id },
      include: { items: true },
    });
  });
};

const voidTransaksi = async (id, tokoId) => {
  const transaksi = await prisma.transaksi.findUnique({ where: { id, tokoId } });
  if (!transaksi) throw { statusCode: 404, message: 'Transaksi not found' };
  if (transaksi.status === 'VOID') throw { statusCode: 400, message: 'Already voided' };

  return prisma.$transaction(async (tx) => {
    await tx.transaksi.update({
      where: { id, tokoId },
      data: { status: 'VOID' },
    });

    // Revert shift total if applicable
    if (transaksi.shiftId) {
      await tx.shift.update({
        where: { id: transaksi.shiftId },
        data: {
          totalPenjualan: { decrement: transaksi.total },
          jumlahTrx: { decrement: 1 },
        },
      });
    }

    return { message: 'Transaksi voided' };
  });
};

module.exports = {
  getTransaksi,
  getTransaksiById,
  createTransaksi,
  voidTransaksi,
};
