const joi = require('joi');
const { objectId, phoneNumberValidate } = require('./custorm.validation');

const createCategory = {
  body: joi.object().keys({
    name: joi.string().min(2).max(255).required().messages({
      'any.required': 'Vui lòng điền tên danh mục',
    })
  }),
};

const getCategories = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getCategoryById = {
  params: joi.object({
    categoryId: joi.string().required().custom(objectId),
  }),
};

const updateCategoryById = {
  params: joi.object({
    categoryId: joi.string().required().custom(objectId),
  }),
  body: joi.object().keys({
    name: joi.string().min(2).max(255).optional().messages({
      'any.required': 'Vui lòng điền tên danh mục',
    }),
    image: joi.string().email().optional(),
  }).or('name', 'image').messages({
    'object.missing': 'Ít nhất một trong các trường name hoặc image là bắt buộc',
  })
};


const deleteCategoryById = {
  params: joi.object({
    categoryId: joi.string().required().custom(objectId),
  }),
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
