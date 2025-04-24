//purchaseController.js
const { Payment } = require('../models');
const { success, error } = require('../utils/apiResponse');

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      user_id: req.user.userId,
      ad_id: req.body.ad_id,
      amount: req.body.amount,
      status: 'pending'
    });

    const populatedPayment = await Payment.findByPk(payment.id, {
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'username'] },
        { model: Ad, as: 'ad', attributes: ['id', 'title'] }
      ]
    });

    success(res, 201, populatedPayment);
  } catch (err) {
    error(res, 500, 'Payment creation failed', err);
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.user.userId },
      include: [
        { model: Ad, as: 'ad', attributes: ['id', 'title'] }
      ],
      order: [['payment_date', 'DESC']]
    });

    success(res, 200, payments);
  } catch (err) {
    error(res, 500, 'Failed to fetch payment history', err);
  }
};