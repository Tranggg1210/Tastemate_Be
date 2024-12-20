const joi = require('joi');
const { objectId, phoneNumberValidate } = require('./custom.validation');

const createSupplier = {
  body: joi.object().keys({
    name: joi.string().min(2).max(255).required().messages({
      'any.required': 'Vui lòng điền tên nhà cung cấp',
    }),
    email: joi.string().email().required(),
    phoneNumber: joi.string().custom(phoneNumberValidate),
    address: joi.string().required().messages({
      'any.required': 'Vui lòng nhập địa chỉ nhà cung cấp',
    }),
  }),
};

const getSuppliers = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getSupplierById = {
  params: joi.object({
    supplierId: joi.string().required().custom(objectId),
  }),
};

const updateSupplierById = {
  params: joi.object({
    supplierId: joi.string().required().custom(objectId),
  }),
  body: joi
    .object()
    .keys({
      name: joi.string().min(2).max(255).optional().messages({
        'any.required': 'Vui lòng điền tên nhà cung cấp',
      }),
      email: joi.string().email().optional(),
      phoneNumber: joi.string().custom(phoneNumberValidate),
      address: joi.string().optional().messages({
        'any.required': 'Vui lòng nhập địa chỉ nhà cung cấp',
      }),
    })
    .or('name', 'email', 'phoneNumber', 'address')
    .messages({
      'object.missing': 'Ít nhất một trong các trường name, phoneNumber, email hoặc address là bắt buộc',
    }),
};

const deleteSupplierById = {
  params: joi.object({
    supplierId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
};
