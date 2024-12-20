const express = require('express');

const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const orderController = require('../controllers/order.controller');
const orderValidation = require('../validations/order.validation');

const orderRoute = express.Router();

orderRoute.post('/', auth, validate(orderValidation.create), orderController.create);

orderRoute.get('/me', auth, validate(orderValidation.getMyOrders), orderController.getMyOrders);

orderRoute.put('/:orderId/cancel', auth, validate(orderValidation.cancelOrder), orderController.cancelOrder);

module.exports = orderRoute;
