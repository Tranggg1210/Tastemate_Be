const httpStatus = require('http-status');
const { intersection, map } = require('lodash');

const Cart = require('../models/cart.model');
const ApiError = require('../utils/ApiError');
const Order = require('../models/order.model');
const catchAsync = require('../utils/catchAsync');
const Ingredient = require('../models/ingredients.model');
const { ORDER_STATUS_ENUM, ORDER_ACTION_ENUM } = require('../constants');

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
    histories: [
      {
        action: ORDER_ACTION_ENUM.CREATED,
        description: 'Bạn đã đặt đơn hàng',
      },
    ],
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
      update: { $inc: { stockQuantity: -item.quantity } },
    },
  }));

  await Ingredient.bulkWrite(IncIngredients);

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Đặt đơn hàng thành công',
    data: {},
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt:desc', status = '' } = req.query;

  const skip = (+page - 1) * +limit;
  const filters = { user: req.user._id };
  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  if (status) {
    filters.status = status;
  }

  const [orders, totalResults] = await Promise.all([
    Order.find(filters)
      .populate({
        path: 'orderDetails.ingredient',
        model: 'Ingredients',
      })
      .sort(sort)
      .skip(skip)
      .limit(+limit),
    Order.countDocuments(filters),
  ]);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách đơn hàng thành công',
    data: {
      orders,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const cancelOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;
  const reason = req.body?.reason;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, user: userId, status: ORDER_STATUS_ENUM.PENDING },
    {
      status: ORDER_STATUS_ENUM.CANCELLED,
      $push: {
        histories: {
          action: ORDER_ACTION_ENUM.CANCELLED,
          description: 'Bạn đã hủy đơn hàng' + (reason ? ` vì lý do: ${reason}` : ''),
        },
      },
    },
    { new: true },
  );

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }

  const IncIngredients = order.orderDetails?.map((item) => ({
    updateOne: {
      filter: { _id: item.ingredient._id },
      update: { $inc: { stockQuantity: item.quantity } },
    },
  }));

  await Ingredient.bulkWrite(IncIngredients);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Hủy đơn hàng thành công',
    data: {},
  });
});

module.exports = { create, getMyOrders, cancelOrder };
