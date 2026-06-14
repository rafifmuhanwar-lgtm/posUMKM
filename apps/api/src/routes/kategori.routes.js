const express = require('express');
const kategoriController = require('../controllers/kategori.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', kategoriController.getKategori);
router.post('/', roleMiddleware('OWNER'), kategoriController.createKategori);
router.put('/:id', roleMiddleware('OWNER'), kategoriController.updateKategori);
router.delete('/:id', roleMiddleware('OWNER'), kategoriController.deleteKategori);
router.patch('/urutan', roleMiddleware('OWNER'), kategoriController.updateUrutan);

module.exports = router;
