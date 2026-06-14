const express = require('express');
const shiftController = require('../controllers/shift.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/aktif', shiftController.getAktif);
router.post('/buka', shiftController.bukaShift);
router.post('/tutup', shiftController.tutupShift);

module.exports = router;
