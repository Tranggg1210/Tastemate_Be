const express = require('express');

const upload = require('../middlewares/multer.middleware');
const validate = require('../middlewares/validate.middleware');
const { auth, author } = require('../middlewares/auth.middleware');
const ingredientsController = require('../controllers/ingredients.controller');
const ingredientsValidation = require('../validations/ingredients.validation');

const ingredientsRoute = express.Router();

ingredientsRoute
  .route('/')
  .post(
    auth,
    author(['admin', 'member']),
    upload.single('image'),
    validate(ingredientsValidation.createIngredient),
    ingredientsController.createIngredients,
  )
  .get(
    auth,
    author(['admin', 'member']),
    validate(ingredientsValidation.getIngredients),
    ingredientsController.getIngredients,
  );
ingredientsRoute
  .route('/:ingredientId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(ingredientsValidation.getIngredientById),
    ingredientsController.getIngredientById,
  )
  .put(
    auth,
    author(['admin', 'member']),
    upload.single('image'),
    validate(ingredientsValidation.updateIngredientById),
    ingredientsController.updateIngredientById,
  )
  .delete(
    auth,
    author(['admin', 'member']),
    validate(ingredientsValidation.deleteIngredientById),
    ingredientsController.deleteIngredientById,
  );

ingredientsRoute
  .route('/categories/:categoryId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(ingredientsValidation.getIngredientsByCategoryId),
    ingredientsController.getIngredientsByCategoryId,
  )

ingredientsRoute
  .route('/suppliers/:supplierId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(ingredientsValidation.getIngredientsBySupplierId),
    ingredientsController.getIngredientsBySupplierId,
  )

module.exports = ingredientsRoute;
