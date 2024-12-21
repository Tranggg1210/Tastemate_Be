const express = require('express');

const validate = require('../middlewares/validate.middleware');
const { auth, author } = require('../middlewares/auth.middleware');
const dishesRecipesController = require('../controllers/dishes-recipes.controller');
const dishesRecipesValidation = require('../validations/dishes-recipes.validation');

const dishesRecipesRoute = express.Router();

dishesRecipesRoute
  .route('/')
  .post(
    auth,
    author(['admin', 'member']),
    validate(dishesRecipesValidation.createDishesRecipes),
    dishesRecipesController.createDishesRecipes,
  );
dishesRecipesRoute
  .route('/:dishesRecipesId')
  .put(
    auth,
    author(['admin', 'member']),
    validate(dishesRecipesValidation.updateDishesRecipesById),
    dishesRecipesController.updateDishesRecipesById,
  )
  .delete(
    auth,
    author(['admin', 'member']),
    validate(dishesRecipesValidation.deleteDishesRecipesById),
    dishesRecipesController.deleteDishesRecipesById,
  );

dishesRecipesRoute
  .route('/dishes/:dishesId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(dishesRecipesValidation.getDishesRecipesByDishesId),
    dishesRecipesController.getDishesRecipesByDishesId,
  )

module.exports = dishesRecipesRoute;
