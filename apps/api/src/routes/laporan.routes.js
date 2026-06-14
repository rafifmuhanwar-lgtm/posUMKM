const express = require('express');
const laporanController = require('../controllers/laporan.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('OWNER'));

router.get('/harian', laporanController.getHarian);
router.get('/ringkasan', laporanController.getRingkasan);
router.get('/item-terlaris', laporanController.getItemTerlaris);
router.get('/per-kasir', laporanController.getPerKasir);

module.exports = router;
