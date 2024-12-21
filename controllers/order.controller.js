const httpStatus = require('http-status');
const { intersection, map } = require('lodash');

const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ORDER_STATUS_ENUM } = require('../constants');
const Ingredient = require('../models/ingredients.model');

const create = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId })
    .populate([
      {
        path: 'cartDetails.ingredient',
        model: 'Ingredients',
      },
    ])
    .lean();

  const cartDetailsExist = map(cart?.cartDetails, '_id')?.map(String);
  const sameCartDetails = intersection(req.body.cartDetails, cartDetailsExist);

  if (sameCartDetails.length !== req.body.cartDetails.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nguyên liệu không có trong giỏ hàng');
  }

  const orderDetails = cart.cartDetails.filter((item) => {
    return sameCartDetails.includes(item._id.toString());
  });

  const totalPriceOrder = orderDetails.reduce((total, item) => total + item.ingredient.price * item.quantity, 0);

  await Order.create({
    user: userId,
    note: req.body.note,
    phoneNumber: req.body.phoneNumber,
    recipientName: req.body.recipientName,
    detailAddress: req.body.detailAddress,
    totalPrice: totalPriceOrder,
    status: ORDER_STATUS_ENUM.PENDING,
    orderDetails: orderDetails.map((item) => ({
      quantity: item.quantity,
      price: item.ingredient.price,
      ingredient: item.ingredient._id,
      totalPrice: item.ingredient.price * item.quantity,
    })),
  });

  await Cart.updateOne(
    { user: userId },
    {
      $pull: { cartDetails: { _id: { $in: sameCartDetails } } },
    },
  );

  const IncIngredients = orderDetails?.map((item) => ({
    updateOne: {
      filter: { _id: item.ingredient._id },
      update: { $inc: { quantity: -item.quantity } },
    },
  }));

  await Ingredient.bulkWrite(IncIngredients);

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Đặt đơn hàng thành công',
    data: {},
  });
});

module.exports = { create };
