const laporanService = require('../services/laporan.service');
const { sendResponse } = require('../utils/response');

const getDefaultDates = () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  return { dari: dateStr, sampai: dateStr };
};

const getHarian = async (req, res, next) => {
  try {
    const { tanggal } = req.query;
    const tgl = tanggal || new Date().toISOString().slice(0, 10);
    const result = await laporanService.getHarian(req.user.tokoId, tgl);
    return sendResponse(res, 200, true, result, 'Laporan harian');
  } catch (error) {
    next(error);
  }
};

const getRingkasan = async (req, res, next) => {
  try {
    const { dari, sampai } = Object.assign(getDefaultDates(), req.query);
    const result = await laporanService.getRingkasan(req.user.tokoId, dari, sampai);
    return sendResponse(res, 200, true, result, 'Laporan ringkasan');
  } catch (error) {
    next(error);
  }
};

const getItemTerlaris = async (req, res, next) => {
  try {
    const { dari, sampai, limit } = Object.assign(getDefaultDates(), req.query);
    const result = await laporanService.getItemTerlaris(req.user.tokoId, dari, sampai, limit);
    return sendResponse(res, 200, true, result, 'Item terlaris');
  } catch (error) {
    next(error);
  }
};

const getPerKasir = async (req, res, next) => {
  try {
    const { dari, sampai } = Object.assign(getDefaultDates(), req.query);
    const result = await laporanService.getPerKasir(req.user.tokoId, dari, sampai);
    return sendResponse(res, 200, true, result, 'Kinerja kasir');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHarian,
  getRingkasan,
  getItemTerlaris,
  getPerKasir,
};
