const authService = require('../services/auth.service');
const { sendResponse } = require('../utils/response');
const { z } = require('zod');

const registerSchema = z.object({
  tokoNama: z.string().min(3),
  nama: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  pin: z.string().length(4).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    return sendResponse(res, 201, true, result, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data.email, data.password);
    return sendResponse(res, 200, true, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    return sendResponse(res, 200, true, req.user, 'Current user');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
};
