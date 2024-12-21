const joi = require('joi');
const { objectId } = require('./custom.validation');

const createDishes = {
  body: joi.object().keys({
    name: joi.string().min(2).required().messages({
      'any.required': 'Vui lòng điền tên món ăn',
    }),
    recipe: joi.string().required().messages({
      'any.required': 'Trường công thức không được để trống',
    }),
    description: joi.string().optional()
  }),
};

const getDishes = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getDishesById = {
  params: joi.object({
    dishesId: joi.string().required().custom(objectId),
  }),
};

const updateDishesById = {
  params: joi.object({
    dishesId: joi.string().required().custom(objectId),
  }),
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).optional(),
      recipe: joi.string().optional(),
      description: joi.string().optional()
    })
    .or('name', 'recipe', 'description')
    .messages({
      'object.missing': 'Ít nhất một trong các trường name, recipe, description là bắt buộc',
    }),
};

const deleteDishesById = {
  params: joi.object({
    dishesId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createDishes,
  getDishes,
  getDishesById,
  updateDishesById,
  deleteDishesById,
};
