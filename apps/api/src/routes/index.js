const express = require('express');
const authRoutes = require('./auth.routes');
const tokoRoutes = require('./toko.routes');
const kategoriRoutes = require('./kategori.routes');
const menuRoutes = require('./menu.routes');
const transaksiRoutes = require('./transaksi.routes');
const laporanRoutes = require('./laporan.routes');
const shiftRoutes = require('./shift.routes');
const depositRoutes = require('./deposit.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/toko', tokoRoutes);
router.use('/kategori', kategoriRoutes);
router.use('/menu', menuRoutes);
router.use('/transaksi', transaksiRoutes);
router.use('/laporan', laporanRoutes);
router.use('/shift', shiftRoutes);
router.use('/deposit', depositRoutes);

module.exports = router;
