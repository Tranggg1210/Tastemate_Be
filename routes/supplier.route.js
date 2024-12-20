const express = require('express');

const validate = require('../middlewares/validate.middleware');
const { auth, author } = require('../middlewares/auth.middleware');
const supplierController = require('../controllers/suppliers.controller');
const supplierValidation = require('../validations/suppliers.validation');

const supplierRoute = express.Router();

supplierRoute
  .route('/')
  .post(auth, author(['admin']), validate(supplierValidation.createSupplier), supplierController.createSuppliers)
  .get(auth, author(['admin', 'member']), validate(supplierValidation.getSuppliers), supplierController.getSuppliers);
supplierRoute
  .route('/:supplierId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(supplierValidation.getSupplierById),
    supplierController.getSupplierById,
  )
  .put(auth, author(['admin']), validate(supplierValidation.updateSupplierById), supplierController.updateSupplierById)
  .delete(
    auth,
    author(['admin', 'member']),
    validate(supplierValidation.deleteSupplierById),
    supplierController.deleteSupplierById,
  );

module.exports = supplierRoute;
