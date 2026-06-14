const express = require('express');
const depositController = require('../controllers/deposit.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

// Webhook tidak perlu auth token (karena dipanggil oleh Pakasir)
router.post('/webhook', depositController.handleWebhook);

// Semua rute di bawah perlu auth
router.use(authMiddleware);

router.get('/saldo', depositController.getSaldo);
router.get('/', roleMiddleware('OWNER'), depositController.getRiwayat);
router.post('/', roleMiddleware('OWNER'), depositController.createDeposit);
router.get('/:id/status', roleMiddleware('OWNER'), depositController.checkStatus);

module.exports = router;
