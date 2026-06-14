const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAktif = async (tokoId, userId) => {
  return prisma.shift.findFirst({
    where: {
      tokoId,
      userId,
      tutupAt: null,
    },
  });
};

const bukaShift = async (tokoId, userId, data) => {
  const existing = await getAktif(tokoId, userId);
  if (existing) {
    throw { statusCode: 400, message: 'Shift is already active' };
  }

  return prisma.shift.create({
    data: {
      tokoId,
      userId,
      modalAwal: data.modalAwal || 0,
      bukaAt: new Date(),
    },
  });
};

const tutupShift = async (tokoId, userId, data) => {
  const shift = await getAktif(tokoId, userId);
  if (!shift) {
    throw { statusCode: 400, message: 'No active shift found' };
  }

  const selisih = (data.kasAkhir || 0) - (shift.modalAwal + shift.totalPenjualan);

  return prisma.shift.update({
    where: { id: shift.id },
    data: {
      kasAkhir: data.kasAkhir,
      selisih,
      tutupAt: new Date(),
      catatan: data.catatan,
    },
  });
};

module.exports = {
  getAktif,
  bukaShift,
  tutupShift,
};
