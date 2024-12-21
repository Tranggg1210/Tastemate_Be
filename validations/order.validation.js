const joi = require('joi');

const { objectId, phoneNumberValidate } = require('./custom.validation');

const create = {
  body: joi.object().keys({
    cartDetails: joi.array().items(joi.string().custom(objectId)).required(),
    note: joi.string().min(2).max(1000).optional(),
    recipientName: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền tên người nhận',
    }),
    detailAddress: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền địa chỉ chi tiết',
    }),
    phoneNumber: joi
      .string()
      .required()
      .messages({
        'any.required': 'Vui lòng điền số điện thoại',
      })
      .custom(phoneNumberValidate),
  }),
};

module.exports = {
  create,
};
