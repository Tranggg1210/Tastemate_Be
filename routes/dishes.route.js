const express = require('express');

const upload = require('../middlewares/multer.middleware');
const validate = require('../middlewares/validate.middleware');
const { auth, author } = require('../middlewares/auth.middleware');
const dishesController = require('../controllers/dishes.controller');
const dishesValidation = require('../validations/dishes.validation');

const dishesRoute = express.Router();

dishesRoute
  .route('/')
  .post(
    auth,
    author(['admin', 'member']),
    upload.single('image'),
    validate(dishesValidation.createDishes),
    dishesController.createDishes,
  )
  .get(
    auth,
    author(['admin', 'member']),
    validate(dishesValidation.getDishes),
    dishesController.getDishes,
  );
dishesRoute
  .route('/:dishesId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(dishesValidation.getDishesById),
    dishesController.getDishesById,
  )
  .put(
    auth,
    author(['admin', 'member']),
    upload.single('image'),
    validate(dishesValidation.updateDishesById),
    dishesController.updateDishesById,
  )
  .delete(
    auth,
    author(['admin', 'member']),
    validate(dishesValidation.deleteDishesById),
    dishesController.deleteDishesById,
  );

module.exports = dishesRoute;
