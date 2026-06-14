const { sendResponse } = require('../utils/response');

// Roles hierarchy: OWNER > KASIR_SENIOR > KASIR
const ROLE_LEVELS = {
  OWNER: 3,
  KASIR_SENIOR: 2,
  KASIR: 1,
};

const roleMiddleware = (minRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.peran) {
      return sendResponse(res, 403, false, null, 'Access denied: No role assigned');
    }

    const userLevel = ROLE_LEVELS[req.user.peran];
    const requiredLevel = ROLE_LEVELS[minRole];

    if (userLevel < requiredLevel) {
      return sendResponse(res, 403, false, null, 'Access denied: Insufficient privileges');
    }

    next();
  };
};

module.exports = roleMiddleware;
