const httpStatus = require('http-status');
const { ObjectId } = require('mongoose').Types;

const Cart = require('../models/cart.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Ingredient = require('../models/ingredients.model');

const getMe = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate([
      {
        path: 'cartDetails.ingredient',
        model: 'Ingredients',
      },
    ])
    .lean();

  const cartWithDetails = {
    ...cart,
    totalQuantity: cart.cartDetails.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cart.cartDetails.reduce((total, item) => total + item.ingredient.price * item.quantity, 0),
    cartDetails: cart.cartDetails.map((item) => ({
      ...item,
      subtotal: item.ingredient.price * item.quantity,
    })),
  };

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin giỏ hàng thành công',
    data: {
      cart: cartWithDetails,
    },
  });
});

const addIngredient = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { ingredientId, quantity } = req.body;

  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu');
  }

  if (quantity > ingredient.quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số lượng nguyên liệu quá hiện có');
  }

  const cart = await Cart.findOne({ user: userId }).populate([
    {
      path: 'cartDetails.ingredient',
      model: 'Ingredients',
    },
  ]);

  const exitsIngredient = cart.cartDetails.find((item) => {
    return item.ingredient._id.toString() === ingredientId.toString();
  });

  if (exitsIngredient) {
    const invalidQuantity = exitsIngredient.quantity + quantity > 1000;
    if (invalidQuantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Số lượng nguyên liệu không được quá 1000');
    }

    await Cart.updateOne(
      { user: userId, 'cartDetails.ingredient': ingredientId },
      { $inc: { 'cartDetails.$.quantity': quantity } },
    );
  } else {
    await Cart.updateOne(
      { user: userId },
      {
        $push: {
          cartDetails: {
            ingredient: new ObjectId(ingredientId),
            quantity,
          },
        },
      },
    );
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Thêm nguyên liệu vào giỏ hàng thành công',
    data: {},
  });
});

const deleteIngredient = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { ingredientId, quantity } = req.body;

  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu');
  }

  const cart = await Cart.findOne({ user: userId }).populate([
    {
      path: 'cartDetails.ingredient',
      model: 'Ingredients',
    },
  ]);

  const exitsIngredient = cart.cartDetails.find((item) => {
    return item.ingredient._id.toString() === ingredientId.toString();
  });

  if (!exitsIngredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu trong giỏ hàng');
  }

  const currentQuantity = exitsIngredient.quantity;
  const newQuantity = currentQuantity - quantity;

  if (newQuantity < 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Số lượng không hợp lệ');
  } else if (newQuantity === 0) {
    await Cart.updateOne({ user: userId }, { $pull: { cartDetails: { ingredient: ingredientId } } });
  } else {
    await Cart.updateOne(
      { user: userId, 'cartDetails.ingredient': ingredientId },
      { $set: { 'cartDetails.$.quantity': newQuantity } },
    );
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Xóa nguyên liệu khỏi giỏ hàng thành công',
    data: {},
  });
});

const resetCart = catchAsync(async (req, res) => {
  await Cart.updateOne({ user: req.user._id }, { cartDetails: [] });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Reset giỏ hàng thành công',
    data: {},
  });
});

module.exports = { getMe, addIngredient, deleteIngredient, resetCart };
