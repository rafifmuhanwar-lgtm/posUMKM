const express = require('express');
const menuController = require('../controllers/menu.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', menuController.getMenu);
// KASIR_SENIOR atau OWNER bisa mengelola menu, KASIR cuma bisa baca
router.post('/', roleMiddleware('KASIR_SENIOR'), menuController.createMenu);
router.put('/:id', roleMiddleware('KASIR_SENIOR'), menuController.updateMenu);
router.delete('/:id', roleMiddleware('OWNER'), menuController.deleteMenu); // Delete usually owner only
router.patch('/:id/toggle', roleMiddleware('KASIR'), menuController.toggleTersedia); // Kasir biasa bisa set menu habis

module.exports = router;
