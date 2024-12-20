const joi = require('joi');
const { password, objectId, phoneNumberValidate } = require('./custom.validation');

const createUser = {
  body: joi.object().keys({
    fullname: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền họ tên người dùng',
    }),
    email: joi.string().email().required(),
    password: joi.string().required().custom(password),
    role: joi.string(),
    avatar: joi.string(),
    phoneNumber: joi.string().custom(phoneNumberValidate),
  }),
};

const getUsers = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
};

const updateUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
  body: joi
    .object()
    .keys({
      fullname: joi.string().min(2).max(45).optional().messages({
        'string.base': 'Họ tên phải là một chuỗi',
        'string.min': 'Họ tên phải có ít nhất 2 ký tự',
        'string.max': 'Họ tên không được vượt quá 45 ký tự',
        'any.required': 'Vui lòng điền họ tên người dùng',
      }),
      avatar: joi.string().optional(),
      role: joi.string().optional().valid('admin', 'member').messages({
        'any.only': 'Vai trò chỉ có thể là "admin" hoặc "member"',
      }),
      phoneNumber: joi.string().custom(phoneNumberValidate),
    })
    .or('fullname', 'phoneNumber', 'avatar', 'role')
    .messages({
      'object.missing': 'Ít nhất một trong các trường fullname, phoneNumber, avatar hoặc role là bắt buộc',
    }),
};

const deleteUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
};

const lockUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  lockUserById,
};
