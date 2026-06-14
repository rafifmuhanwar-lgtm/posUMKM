const express = require('express');
const transaksiController = require('../controllers/transaksi.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', transaksiController.getTransaksi);
router.post('/', transaksiController.createTransaksi);
router.get('/:id', transaksiController.getTransaksiById);
router.patch('/:id/void', roleMiddleware('KASIR_SENIOR'), transaksiController.voidTransaksi);

module.exports = router;
