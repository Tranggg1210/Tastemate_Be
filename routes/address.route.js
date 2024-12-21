const express = require('express');

const { auth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const addressController = require('../controllers/address.controller');
const addressValidation = require('../validations/address.validation');

const addressRoute = express.Router();

addressRoute
  .route('/')
  .post(auth, validate(addressValidation.createAddress), addressController.createAddress)
  .get(auth, validate(addressValidation.getListAddresses), addressController.getListAddresses);

addressRoute
  .route('/:addressId')
  .get(auth, validate(addressValidation.getAddressById), addressController.getAddressById)
  .put(auth, validate(addressValidation.updateAddressById), addressController.updateAddressById)
  .delete(auth, validate(addressValidation.deleteAddressById), addressController.deleteAddressById);

module.exports = addressRoute;
