const express = require('express');
const tokoController = require('../controllers/toko.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

// Only OWNER can manage Toko settings
router.use(authMiddleware);

router.get('/', tokoController.getToko);
router.put('/', roleMiddleware('OWNER'), tokoController.updateToko);
router.get('/template/:jenis', roleMiddleware('OWNER'), tokoController.getTemplate);

module.exports = router;
