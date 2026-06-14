const shiftService = require('../services/shift.service');
const { sendResponse } = require('../utils/response');
const { z } = require('zod');

const bukaSchema = z.object({
  modalAwal: z.number().int().min(0).default(0),
});

const tutupSchema = z.object({
  kasAkhir: z.number().int().min(0),
  catatan: z.string().optional().nullable(),
});

const getAktif = async (req, res, next) => {
  try {
    const shift = await shiftService.getAktif(req.user.tokoId, req.user.id);
    return sendResponse(res, 200, true, shift, shift ? 'Active shift found' : 'No active shift');
  } catch (error) {
    next(error);
  }
};

const bukaShift = async (req, res, next) => {
  try {
    const data = bukaSchema.parse(req.body);
    const shift = await shiftService.bukaShift(req.user.tokoId, req.user.id, data);
    return sendResponse(res, 201, true, shift, 'Shift opened');
  } catch (error) {
    next(error);
  }
};

const tutupShift = async (req, res, next) => {
  try {
    const data = tutupSchema.parse(req.body);
    const shift = await shiftService.tutupShift(req.user.tokoId, req.user.id, data);
    return sendResponse(res, 200, true, shift, 'Shift closed');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAktif,
  bukaShift,
  tutupShift,
};
