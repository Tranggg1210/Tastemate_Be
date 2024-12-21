const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartDetailSchema = new Schema(
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
  },
  { timestamps: true },
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartDetails: {
      type: [cartDetailSchema],
      required: false,
      default: [],
    },
  },
  { timestamps: true },
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
