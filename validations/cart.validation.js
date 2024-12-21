const joi = require('joi');

const { objectId } = require('./custom.validation');

const addIngredient = {
  body: joi.object().keys({
    ingredientId: joi
      .string()
      .required()
      .messages({
        'any.required': 'Vui lòng điền Id nguyên liệu',
      })
      .custom(objectId),
    quantity: joi.number().min(1).max(1000).required().messages({
      'any.required': 'Vui lòng điền số lượng nguyên liệu',
    }),
  }),
};

const deleteIngredient = addIngredient;

module.exports = {
  addIngredient,
  deleteIngredient,
};
