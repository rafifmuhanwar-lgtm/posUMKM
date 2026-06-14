const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getKategori = async (tokoId) => {
  return prisma.kategori.findMany({
    where: { tokoId },
    orderBy: { urutan: 'asc' },
  });
};

const createKategori = async (tokoId, data) => {
  return prisma.kategori.create({
    data: {
      tokoId,
      ...data,
    },
  });
};

const updateKategori = async (id, tokoId, data) => {
  return prisma.kategori.update({
    where: { id, tokoId },
    data,
  });
};

const deleteKategori = async (id, tokoId) => {
  // Check if there are menus using this category
  const menus = await prisma.menu.count({ where: { kategoriId: id } });
  if (menus > 0) {
    throw { statusCode: 400, message: 'Cannot delete category with existing menus' };
  }
  return prisma.kategori.delete({
    where: { id, tokoId },
  });
};

const updateUrutan = async (tokoId, urutanData) => {
  // urutanData = [{ id: 'kategori1', urutan: 1 }, { id: 'kategori2', urutan: 2 }]
  const updates = urutanData.map((item) =>
    prisma.kategori.update({
      where: { id: item.id, tokoId },
      data: { urutan: item.urutan },
    })
  );
  return prisma.$transaction(updates);
};

module.exports = {
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  updateUrutan,
};
