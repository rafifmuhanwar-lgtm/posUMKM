const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMenu = async (tokoId, filters = {}) => {
  const where = { tokoId };
  if (filters.kategoriId) where.kategoriId = filters.kategoriId;
  if (filters.tersedia !== undefined) where.tersedia = filters.tersedia;

  return prisma.menu.findMany({
    where,
    orderBy: [
      { kategori: { urutan: 'asc' } },
      { urutan: 'asc' },
    ],
    include: {
      kategori: true,
    },
  });
};

const createMenu = async (tokoId, data) => {
  return prisma.menu.create({
    data: {
      tokoId,
      ...data,
    },
  });
};

const updateMenu = async (id, tokoId, data) => {
  return prisma.menu.update({
    where: { id, tokoId },
    data,
  });
};

const deleteMenu = async (id, tokoId) => {
  // Instead of hard delete, maybe soft delete if related to transactions.
  // But for now, we try to delete. If it fails due to FK, we'll let the error handler catch it.
  return prisma.menu.delete({
    where: { id, tokoId },
  });
};

const toggleTersedia = async (id, tokoId) => {
  const menu = await prisma.menu.findUnique({ where: { id, tokoId } });
  if (!menu) throw { statusCode: 404, message: 'Menu not found' };

  return prisma.menu.update({
    where: { id, tokoId },
    data: { tersedia: !menu.tersedia },
  });
};

module.exports = {
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleTersedia,
};
