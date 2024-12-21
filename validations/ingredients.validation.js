const joi = require('joi');
const { objectId } = require('./custom.validation');

const createIngredient = {
  body: joi.object().keys({
    name: joi.string().min(2).required().messages({
      'any.required': 'Vui lòng điền tên nguyên liệu',
    }),
    nutritionalValue: joi.number().required().messages({
      'any.required': 'Trường dinh dưỡng không được để trống',
    }),
    description: joi.string().required().messages({
      'any.required': 'Trường mô tả không được để trống',
    }),
    image: joi.string().optional(),
    unit: joi.string().required().messages({
      'any.required': 'Trường đơn vị không được để trống',
    }),
    price: joi.number().required().messages({
      'any.required': 'Trường giá không được để trống',
    }),
    stockQuantity: joi.number().required().messages({
      'any.required': 'Trường số lượng không được để trống',
    }),
    supplier: joi.string().required().custom(objectId).messages({
      'any.required': 'Trường nhà cung cấp không được để trống',
    }),
    category: joi.string().required().custom(objectId).messages({
      'any.required': 'Trường danh mục không được để trống',
    }),
  }),
};

const getIngredients = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getIngredientById = {
  params: joi.object({
    ingredientId: joi.string().required().custom(objectId),
  }),
};

const getIngredientsByCategoryId = {
  params: joi.object({
    categoryId: joi.string().required().custom(objectId),
  }),
};

const getIngredientsBySupplierId = {
  params: joi.object({
    supplierId: joi.string().required().custom(objectId),
  }),
};

const updateIngredientById = {
  params: joi.object({
    ingredientId: joi.string().required().custom(objectId),
  }),
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(255).optional(),
      image: joi.string().optional(),
      nutritionalValue: joi.number().optional(),
      description: joi.string().optional(),
      unit: joi.string().optional(),
      price: joi.number().optional(),
      stockQuantity: joi.number().optional(),
      supplier: joi.string().optional().custom(objectId),
      category: joi.string().optional().custom(objectId),
    })
    .or('name', 'image', 'nutritionalValue', 'description', 'unit', 'price', 'stockQuantity', 'supplier', 'supplier')
    .messages({
      'object.missing':
        'Ít nhất nhập một trong các trường name, image, nutritionalValue, description, unit, price, stockQuantity, supplier hoặc supplier là bắt buộc',
    }),
};

const deleteIngredientById = {
  params: joi.object({
    ingredientId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredientById,
  deleteIngredientById,
  getIngredientsByCategoryId,
  getIngredientsBySupplierId,
};
