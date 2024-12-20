const joi = require('joi');

const { objectId, phoneNumberValidate } = require('./custom.validation');

const createAddress = {
  body: joi.object().keys({
    recipientName: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền tên người nhận',
    }),
    detailAddress: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền địa chỉ chi tiết',
    }),
    phoneNumber: joi
      .string()
      .min(9)
      .max(12)
      .required()
      .messages({
        'any.required': 'Vui lòng điền số điện thoại',
      })
      .custom(phoneNumberValidate),
  }),
};

const getListAddresses = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getAddressById = {
  params: joi.object({
    addressId: joi.string().required().custom(objectId),
  }),
};

const updateAddressById = {
  params: joi.object({
    addressId: joi.string().required().custom(objectId),
  }),
  body: joi
    .object()
    .keys({
      recipientName: joi.string().min(2).max(45).optional(),
      detailAddress: joi.string().min(2).max(45).optional(),
      phoneNumber: joi.string().min(9).max(12).optional().custom(phoneNumberValidate),
    })
    .or('recipientName', 'detailAddress', 'phoneNumber')
    .messages({
      'object.missing': 'Ít nhất một trong các trường recipientName, detailAddress, phoneNumber là bắt buộc',
    }),
};

const deleteAddressById = {
  params: joi.object({
    addressId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createAddress,
  getAddressById,
  getListAddresses,
  updateAddressById,
  deleteAddressById,
};
