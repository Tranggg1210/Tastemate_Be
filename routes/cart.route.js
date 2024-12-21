const express = require('express');

const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const cartController = require('../controllers/cart.controller');
const cartValidation = require('../validations/cart.validation');

const cartRoute = express.Router();

cartRoute.get('/me', auth, cartController.getMe);

cartRoute.delete('/reset', auth, cartController.resetCart);

cartRoute.put('/add-ingredient', auth, validate(cartValidation.addIngredient), cartController.addIngredient);

cartRoute.put('/remove-ingredient', auth, validate(cartValidation.deleteIngredient), cartController.deleteIngredient);

module.exports = cartRoute;
