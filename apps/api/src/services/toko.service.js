const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getToko = async (tokoId) => {
  const toko = await prisma.toko.findUnique({
    where: { id: tokoId },
  });
  if (!toko) throw { statusCode: 404, message: 'Toko not found' };
  return toko;
};

const updateToko = async (tokoId, data) => {
  const toko = await prisma.toko.update({
    where: { id: tokoId },
    data,
  });
  return toko;
};

const getTemplate = async (jenis) => {
  // Hardcoded template for categories based on store type
  const templates = {
    pecel_ayam: ['Ayam', 'Bebek', 'Lele', 'Nasi', 'Minuman'],
    mie_ayam: ['Mie Ayam', 'Bakso', 'Minuman'],
    warkop: ['Indomie', 'Roti Bakar', 'Minuman Dingin', 'Minuman Panas'],
    warteg: ['Nasi', 'Lauk Pauk', 'Sayur', 'Minuman'],
    custom: ['Makanan', 'Minuman'],
  };
  return templates[jenis] || templates['custom'];
};

module.exports = {
  getToko,
  updateToko,
  getTemplate,
};
