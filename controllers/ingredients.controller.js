const httpStatus = require('http-status');
const Ingredients = require('../models/ingredients.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../configs/cloudinary.config');


const createIngredients = catchAsync(async (req, res) => {
  const newIngredient = await Ingredients.create(req.body);

  const file = req.file;
  if (file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      newIngredient.image = image.url;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload image');
    }
  }

  await newIngredient.save();

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo mới nguyên liệu thành công',
    data: {
      newIngredient,
    },
  });
});

const getIngredients = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt : desc, name: desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const ingredients = await Ingredients.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await Ingredients.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách nguyên liệu thành công',
    data: {
      ingredients,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getIngredientById = catchAsync(async (req, res) => {
  const ingredientId = req.params.ingredientId;

  const ingredient = await Ingredients.findById(ingredientId);

  if (!ingredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin nguyên liệu thành công',
    data: {
      ingredient,
    },
  });
});

const getIngredientsByCategoryId = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;

  const ingredients = await Ingredients.find({ categoryId });

  if (!ingredients) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy danh sách nguyên liệu');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách nguyên liệu thành công',
    data: {
      ingredients,
    },
  });
});

const getIngredientsBySupplierId = catchAsync(async (req, res) => {
  const supplierId = req.params.supplierId;

  const ingredients = await Ingredients.find({ supplierId });

  if (!ingredients) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy danh sách nguyên liệu');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách nguyên liệu thành công',
    data: {
      ingredients,
    },
  });
});

const updateIngredientById = catchAsync(async (req, res) => {
  const ingredient = await Ingredients.findById(req.params.ingredientId);
  if (!ingredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu');
  }
  Object.assign(ingredient, req.body);

  const file = req.file;
  if (file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      ingredient.image = image.url;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload image');
    }
  }

  await ingredient.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin nguyên liệu thành công',
    code: httpStatus.OK,
    data: {
      ingredient,
    },
  });
});

const deleteIngredientById = catchAsync(async (req, res) => {
  const ingredient = await Ingredients.findByIdAndDelete(req.params.ingredientId);

  if (!ingredient) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy nguyên liệu`);
  }

  res.status(httpStatus.OK).json({
    message: `Xoá nguyên liệu thành công`,
    code: httpStatus.OK,
    data: {
      ingredient,
    },
  });
});

module.exports = {
  createIngredients,
  getIngredients,
  getIngredientById,
  updateIngredientById,
  deleteIngredientById,
  getIngredientsByCategoryId,
  getIngredientsBySupplierId
};
