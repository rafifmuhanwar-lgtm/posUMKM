const depositService = require('../services/deposit.service');
const { sendResponse } = require('../utils/response');

const getSaldo = async (req, res, next) => {
  try {
    const tokoId = req.user.tokoId;
    const saldo = await depositService.getSaldo(tokoId);
    return sendResponse(res, 200, true, saldo, 'Berhasil mengambil saldo poin');
  } catch (error) {
    next(error);
  }
};

const getRiwayat = async (req, res, next) => {
  try {
    const tokoId = req.user.tokoId;
    const riwayat = await depositService.getRiwayat(tokoId);
    return sendResponse(res, 200, true, riwayat, 'Berhasil mengambil riwayat deposit');
  } catch (error) {
    next(error);
  }
};

const createDeposit = async (req, res, next) => {
  try {
    const tokoId = req.user.tokoId;
    const { nominalRupiah, catatan } = req.body;
    
    if (!nominalRupiah || isNaN(nominalRupiah)) {
      return res.status(400).json({ success: false, message: 'Nominal Rupiah tidak valid' });
    }

    const deposit = await depositService.createDeposit(tokoId, nominalRupiah, catatan);
    return sendResponse(res, 201, true, deposit, 'Berhasil membuat deposit. Silakan lanjutkan pembayaran.');
  } catch (error) {
    next(error);
  }
};

const checkStatus = async (req, res, next) => {
  try {
    const tokoId = req.user.tokoId;
    const { id } = req.params;
    const deposit = await depositService.checkDepositStatus(tokoId, id);
    return sendResponse(res, 200, true, deposit, 'Status deposit diperbarui');
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    await depositService.handleWebhook(req.body);
    res.status(200).json({ success: true, message: 'Webhook diterima' });
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getSaldo,
  getRiwayat,
  createDeposit,
  checkStatus,
  handleWebhook
};
