const httpStatus = require('http-status');
const Categories = require('../models/categories.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../configs/cloudinary.config');
const e = require('express');


const createCategory = catchAsync(async (req, res) => {

  const newCategory = await Categories.create(req.body);

  const file = req.file;
  if (file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      newCategory.image = image.url;
    } catch (error) {
      console.log(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload image');
    }
  }

  newCategory.save();

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo mới danh mục thành công',
    data: {
      newCategory,
    },
  });
});

const getCategories = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt : desc, name: desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const categories = await Categories.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await Categories.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách danh mục thành công',
    data: {
      categories,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;

  const category = await Categories.findById(categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy danh mục');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin danh mục thành công',
    data: {
      category,
    },
  });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const category = await Categories.findById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy danh mục');
  }
  Object.assign(category, req.body);

  const file = req.file;
  if (file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      category.image = image.url;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload image');
    }
  }

  await category.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin danh mục thành công',
    code: httpStatus.OK,
    data: {
      category,
    },
  });
});

const deleteCategoryById = catchAsync(async (req, res) => {
  const category = await Categories.findByIdAndDelete(req.params.categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy danh mục`);
  }

  res.status(httpStatus.OK).json({
    message: `Xoá danh mục thành công`,
    code: httpStatus.OK,
    data: {
      category,
    },
  });
});


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
