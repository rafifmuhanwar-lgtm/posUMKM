const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const register = async (data) => {
  const { tokoNama, nama, email, password, pin } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw { statusCode: 400, message: 'Email already exists' };
  }

  // Hash password and pin
  const hashedPassword = await bcrypt.hash(password, 12);
  let hashedPin = null;
  if (pin) {
    hashedPin = await bcrypt.hash(pin, 10);
  }

  // Create Toko and Owner User in transaction
  const result = await prisma.$transaction(async (tx) => {
    const toko = await tx.toko.create({
      data: { nama: tokoNama },
    });

    const user = await tx.user.create({
      data: {
        tokoId: toko.id,
        nama,
        email,
        password: hashedPassword,
        pin: hashedPin,
        peran: 'OWNER',
      },
    });

    return { toko, user };
  });

  const token = generateToken({ id: result.user.id, tokoId: result.toko.id, peran: result.user.peran });
  
  return {
    user: { id: result.user.id, nama: result.user.nama, email: result.user.email, peran: result.user.peran },
    toko: { id: result.toko.id, nama: result.toko.nama },
    token,
  };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.aktif) {
    throw { statusCode: 401, message: 'Invalid credentials or inactive user' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const token = generateToken({ id: user.id, tokoId: user.tokoId, peran: user.peran });

  return {
    user: { id: user.id, nama: user.nama, email: user.email, peran: user.peran, tokoId: user.tokoId },
    token,
  };
};

const loginPin = async (pin) => {
  // To login via PIN without email, we need to find the user by PIN. 
  // However, bcrypt cannot be searched directly. Usually PIN login requires User ID or happens after an initial login/device pairing.
  // For simplicity, we assume we fetch all users (which is bad in scale, but okay per toko if we know tokoId).
  // A better approach is to pass email/username alongside PIN.
  throw { statusCode: 501, message: 'PIN login requires toko context or user ID. Not fully implemented yet.' };
};

module.exports = {
  register,
  login,
  loginPin,
};
