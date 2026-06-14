const kategoriService = require('../services/kategori.service');
const { sendResponse } = require('../utils/response');
const { z } = require('zod');

const kategoriSchema = z.object({
  nama: z.string().min(1),
  urutan: z.number().optional(),
  aktif: z.boolean().optional(),
});

const urutanSchema = z.array(
  z.object({
    id: z.string(),
    urutan: z.number(),
  })
);

const getKategori = async (req, res, next) => {
  try {
    const kategori = await kategoriService.getKategori(req.user.tokoId);
    return sendResponse(res, 200, true, kategori, 'Kategori fetched');
  } catch (error) {
    next(error);
  }
};

const createKategori = async (req, res, next) => {
  try {
    const data = kategoriSchema.parse(req.body);
    const kategori = await kategoriService.createKategori(req.user.tokoId, data);
    return sendResponse(res, 201, true, kategori, 'Kategori created');
  } catch (error) {
    next(error);
  }
};

const updateKategori = async (req, res, next) => {
  try {
    const data = kategoriSchema.parse(req.body);
    const kategori = await kategoriService.updateKategori(req.params.id, req.user.tokoId, data);
    return sendResponse(res, 200, true, kategori, 'Kategori updated');
  } catch (error) {
    next(error);
  }
};

const deleteKategori = async (req, res, next) => {
  try {
    await kategoriService.deleteKategori(req.params.id, req.user.tokoId);
    return sendResponse(res, 200, true, null, 'Kategori deleted');
  } catch (error) {
    next(error);
  }
};

const updateUrutan = async (req, res, next) => {
  try {
    const data = urutanSchema.parse(req.body);
    await kategoriService.updateUrutan(req.user.tokoId, data);
    return sendResponse(res, 200, true, null, 'Urutan updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  updateUrutan,
};
