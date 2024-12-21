const httpStatus = require('http-status');
const Dishes = require('../models/dishes.model');
const DishesRecipes = require('../models/dishes-recipes.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../configs/cloudinary.config');


const createDishes = catchAsync(async (req, res) => {

  const newDishes = await Dishes.create(req.body);

  const file = req.file;
  if (file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      newDishes.image = image.url;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload image');
    }
  }

  newDishes.save();

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo mới món ăn thành công',
    data: {
      newDishes,
    },
  });
});

const getDishes = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt : desc, name: desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const dishes = await Dishes.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await Dishes.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách món ăn thành công',
    data: {
      dishes,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getDishesById = catchAsync(async (req, res) => {
  const dishesId = req.params.dishesId;

  const dishes = await Dishes.findById(dishesId);

  if (!dishes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy món ăn');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin món ăn thành công',
    data: {
      dishes,
    },
  });
});

const updateDishesById = catchAsync(async (req, res) => {
  const dishes = await Dishes.findById(req.params.dishesId);
  if (!dishes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy món ăn');
  }
  Object.assign(dishes, req.body);

  const file = req.file;
  if (file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      dishes.image = image.url;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload image');
    }
  }

  await dishes.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin món ăn thành công',
    code: httpStatus.OK,
    data: {
      dishes,
    },
  });
});

const deleteDishesById = catchAsync(async (req, res) => {
  const dishes = await Dishes.findByIdAndDelete(req.params.dishesId);

  if (!dishes) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy món ăn`);
  }

  await DishesRecipes.deleteMany({ dishes: req.params.dishesId });

  res.status(httpStatus.OK).json({
    message: `Xoá món ăn thành công`,
    code: httpStatus.OK,
    data: {
      dishes,
    },
  });
});


module.exports = {
  createDishes,
  getDishes,
  getDishesById,
  updateDishesById,
  deleteDishesById
};
