const transaksiService = require('../services/transaksi.service');
const { sendResponse } = require('../utils/response');
const { z } = require('zod');

const createTransaksiSchema = z.object({
  shiftId: z.string().optional().nullable(),
  subtotal: z.number().int().min(0),
  diskon: z.number().int().min(0).default(0),
  pajak: z.number().int().min(0).default(0),
  total: z.number().int().min(0),
  metodeBayar: z.enum(['TUNAI', 'QRIS', 'TRANSFER', 'HUTANG']),
  nominalBayar: z.number().int().min(0),
  kembalian: z.number().int().min(0).default(0),
  catatan: z.string().optional().nullable(),
  status: z.enum(['SELESAI', 'HOLD']).optional().default('SELESAI'),
  items: z.array(z.object({
    menuId: z.string(),
    namaMenu: z.string(),
    hargaSatuan: z.number().int().min(0),
    qty: z.number().int().min(1),
    subtotal: z.number().int().min(0),
    catatan: z.string().optional().nullable(),
  })).min(1),
});

const getTransaksi = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.dari) filters.dari = req.query.dari;
    if (req.query.sampai) filters.sampai = req.query.sampai;

    const transaksi = await transaksiService.getTransaksi(req.user.tokoId, filters);
    return sendResponse(res, 200, true, transaksi, 'Transaksi fetched');
  } catch (error) {
    next(error);
  }
};

const getTransaksiById = async (req, res, next) => {
  try {
    const transaksi = await transaksiService.getTransaksiById(req.params.id, req.user.tokoId);
    return sendResponse(res, 200, true, transaksi, 'Transaksi detail fetched');
  } catch (error) {
    next(error);
  }
};

const createTransaksi = async (req, res, next) => {
  try {
    const data = createTransaksiSchema.parse(req.body);
    const transaksi = await transaksiService.createTransaksi(req.user.tokoId, req.user.id, data);
    return sendResponse(res, 201, true, transaksi, 'Transaksi created successfully');
  } catch (error) {
    next(error);
  }
};

const voidTransaksi = async (req, res, next) => {
  try {
    await transaksiService.voidTransaksi(req.params.id, req.user.tokoId);
    return sendResponse(res, 200, true, null, 'Transaksi voided successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransaksi,
  getTransaksiById,
  createTransaksi,
  voidTransaksi,
};
