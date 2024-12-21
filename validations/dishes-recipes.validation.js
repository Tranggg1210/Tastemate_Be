const joi = require('joi');
const { objectId } = require('./custom.validation');

const createDishesRecipes = {
  body: joi.object().keys({
    dishes: joi.string().required().custom(objectId),
    ingredients: joi.string().required().custom(objectId),
    quantity: joi.number().required(),
  }),
};

const getDishesRecipesByDishesId = {
  params: joi.object({
    dishesId: joi.string().required().custom(objectId),
  }),
};

const updateDishesRecipesById = {
  params: joi.object({
    dishesRecipesId: joi.string().required().custom(objectId),
  }),
  body: joi
    .object()
    .keys({
      ingredients: joi.string().optional().custom(objectId),
      quantity: joi.number().optional(),
    })
    .or('ingredients', 'quantity')
    .messages({
      'object.missing': 'Ít nhất một trong các trường ingredients, quantity là bắt buộc',
    }),
};

const deleteDishesRecipesById = {
  params: joi.object({
    dishesRecipesId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createDishesRecipes,
  getDishesRecipesByDishesId,
  updateDishesRecipesById,
  deleteDishesRecipesById,
};
