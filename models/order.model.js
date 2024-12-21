const mongoose = require('mongoose');

const { ORDER_STATUS_ENUM } = require('../constants');

const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const orderDetailSchema = new Schema(
  {
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredients',
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderDetails: {
      type: [orderDetailSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUS_ENUM,
      index: true,
      default: ORDER_STATUS_ENUM.PENDING,
    },
    recipientName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    detailAddress: {
      type: String,
      required: false,
    },
    note: {
      type: String,
      required: false,
    },
    histories: {
      type: [historySchema],
      required: false,
      default: [],
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
