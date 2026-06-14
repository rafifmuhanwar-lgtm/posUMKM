const menuService = require('../services/menu.service');
const { sendResponse } = require('../utils/response');
const { z } = require('zod');

const menuSchema = z.object({
  kategoriId: z.string(),
  nama: z.string().min(1),
  harga: z.number().int().min(0),
  deskripsi: z.string().optional().nullable(),
  fotoUrl: z.string().optional().nullable(),
  tersedia: z.boolean().optional(),
  urutan: z.number().optional(),
});

const getMenu = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.kategoriId) filters.kategoriId = req.query.kategoriId;
    if (req.query.tersedia) filters.tersedia = req.query.tersedia === 'true';

    const menu = await menuService.getMenu(req.user.tokoId, filters);
    return sendResponse(res, 200, true, menu, 'Menu fetched');
  } catch (error) {
    next(error);
  }
};

const createMenu = async (req, res, next) => {
  try {
    const data = menuSchema.parse(req.body);
    const menu = await menuService.createMenu(req.user.tokoId, data);
    return sendResponse(res, 201, true, menu, 'Menu created');
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const data = menuSchema.partial().parse(req.body);
    const menu = await menuService.updateMenu(req.params.id, req.user.tokoId, data);
    return sendResponse(res, 200, true, menu, 'Menu updated');
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    await menuService.deleteMenu(req.params.id, req.user.tokoId);
    return sendResponse(res, 200, true, null, 'Menu deleted');
  } catch (error) {
    next(error);
  }
};

const toggleTersedia = async (req, res, next) => {
  try {
    const menu = await menuService.toggleTersedia(req.params.id, req.user.tokoId);
    return sendResponse(res, 200, true, menu, 'Menu availability toggled');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleTersedia,
};
