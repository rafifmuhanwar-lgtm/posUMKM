const tokoService = require('../services/toko.service');
const { sendResponse } = require('../utils/response');
const { z } = require('zod');

const updateTokoSchema = z.object({
  nama: z.string().optional(),
  alamat: z.string().optional().nullable(),
  telepon: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  jenisToko: z.string().optional(),
  warnaTema: z.string().optional(),
  warnaAksen: z.string().optional(),
  pajak: z.number().optional(),
  footerStruk: z.string().optional().nullable(),
});

const getToko = async (req, res, next) => {
  try {
    const toko = await tokoService.getToko(req.user.tokoId);
    return sendResponse(res, 200, true, toko, 'Toko fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateToko = async (req, res, next) => {
  try {
    const data = updateTokoSchema.parse(req.body);
    const toko = await tokoService.updateToko(req.user.tokoId, data);
    return sendResponse(res, 200, true, toko, 'Toko updated successfully');
  } catch (error) {
    next(error);
  }
};

const getTemplate = async (req, res, next) => {
  try {
    const { jenis } = req.params;
    const template = await tokoService.getTemplate(jenis);
    return sendResponse(res, 200, true, template, 'Template fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getToko,
  updateToko,
  getTemplate,
};
