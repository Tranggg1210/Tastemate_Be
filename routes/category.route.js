const express = require('express');

const upload = require('../middlewares/multer.middleware');
const validate = require('../middlewares/validate.middleware');
const { auth, author } = require('../middlewares/auth.middleware');
const categoriesController = require('../controllers/categories.controller');
const categoriesValidation = require('../validations/categories.validation');

const categoryRoute = express.Router();

categoryRoute
  .route('/')
  .post(
    auth,
    author(['admin']),
    upload.single('image'),
    validate(categoriesValidation.createCategory),
    categoriesController.createCategory,
  )
  .get(
    auth,
    author(['admin', 'member']),
    validate(categoriesValidation.getCategories),
    categoriesController.getCategories,
  );
categoryRoute
  .route('/:categoryId')
  .get(
    auth,
    author(['admin', 'member']),
    validate(categoriesValidation.getCategoryById),
    categoriesController.getCategoryById,
  )
  .put(
    auth,
    author(['admin']),
    upload.single('image'),
    validate(categoriesValidation.updateCategoryById),
    categoriesController.updateCategoryById,
  )
  .delete(
    auth,
    author(['admin', 'member']),
    validate(categoriesValidation.deleteCategoryById),
    categoriesController.deleteCategoryById,
  );

module.exports = categoryRoute;
