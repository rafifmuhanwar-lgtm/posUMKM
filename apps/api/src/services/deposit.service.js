const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const getSaldo = async (tokoId) => {
  const toko = await prisma.toko.findUnique({
    where: { id: tokoId },
    select: { saldoPoin: true },
  });
  return toko.saldoPoin;
};

const getRiwayat = async (tokoId) => {
  const deposits = await prisma.deposit.findMany({
    where: { tokoId },
    orderBy: { createdAt: 'desc' },
  });
  return deposits;
};

const createDeposit = async (tokoId, nominalRupiah, catatan) => {
  // 1 poin = Rp 500
  const jumlahPoin = Math.floor(nominalRupiah / 500);

  if (jumlahPoin <= 0) {
    throw new Error('Nominal terlalu kecil untuk dikonversi menjadi poin');
  }

  // Buat record deposit dengan status PENDING
  const deposit = await prisma.deposit.create({
    data: {
      tokoId,
      jumlahPoin,
      nominalRupiah,
      catatan,
      status: 'PENDING'
    },
  });

  const pakasirSlug = process.env.PAKASIR_SLUG || 'kasir-umkm';
  const paymentUrl = `https://app.pakasir.com/pay/${pakasirSlug}/${nominalRupiah}?order_id=${deposit.id}`;

  return { ...deposit, paymentUrl };
};

const processSuccessfulDeposit = async (depositId) => {
  const result = await prisma.$transaction(async (tx) => {
    const deposit = await tx.deposit.findUnique({ where: { id: depositId } });
    if (!deposit || deposit.status === 'SUCCESS') return deposit;

    // 1. Update status
    const updatedDeposit = await tx.deposit.update({
      where: { id: depositId },
      data: { status: 'SUCCESS' }
    });

    // 2. Tambahkan saldo poin ke Toko
    const toko = await tx.toko.update({
      where: { id: deposit.tokoId },
      data: {
        saldoPoin: { increment: deposit.jumlahPoin },
      },
      select: { saldoPoin: true }
    });

    // 3. Unlock transaksi pending (poinDibayar = false)
    let remainingPoin = toko.saldoPoin;
    const pendingTrx = await tx.transaksi.findMany({
      where: {
        tokoId: deposit.tokoId,
        poinDibayar: false,
      },
      orderBy: { createdAt: 'asc' },
    });

    let unlockedCount = 0;
    const trxToUpdate = [];

    for (const trx of pendingTrx) {
      if (remainingPoin > 0) {
        trxToUpdate.push(trx.id);
        remainingPoin--;
        unlockedCount++;
      } else {
        break; // poin habis
      }
    }

    if (trxToUpdate.length > 0) {
      await tx.transaksi.updateMany({
        where: { id: { in: trxToUpdate } },
        data: { poinDibayar: true },
      });

      await tx.toko.update({
        where: { id: deposit.tokoId },
        data: { saldoPoin: { decrement: unlockedCount } },
      });
    }

    return updatedDeposit;
  });

  return result;
};

const checkDepositStatus = async (tokoId, depositId) => {
  const deposit = await prisma.deposit.findFirst({
    where: { id: depositId, tokoId }
  });

  if (!deposit) throw new Error('Deposit tidak ditemukan');
  if (deposit.status === 'SUCCESS') return deposit;

  const pakasirSlug = process.env.PAKASIR_SLUG || 'kasir-umkm';
  const apiKey = process.env.PAKASIR_API_KEY || '';

  try {
    const response = await axios.get(`https://app.pakasir.com/api/transactiondetail`, {
      params: {
        project: pakasirSlug,
        amount: deposit.nominalRupiah,
        order_id: deposit.id,
        api_key: apiKey
      }
    });

    const data = response.data;
    // Pakasir returns status (e.g. "success", "paid") when payment is done
    if (data && (data.status === 'success' || data.status === 'PAID')) {
      return await processSuccessfulDeposit(deposit.id);
    }
  } catch (error) {
    console.error('Error checking Pakasir status:', error.message);
  }

  return deposit;
};

const handleWebhook = async (body) => {
  const { order_id, status } = body;
  if (!order_id) return;

  if (status === 'success' || status === 'PAID' || status === 'settlement') {
    await processSuccessfulDeposit(order_id);
  }
};

module.exports = {
  getSaldo,
  getRiwayat,
  createDeposit,
  checkDepositStatus,
  handleWebhook,
  processSuccessfulDeposit
};
