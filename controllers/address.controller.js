const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Address = require('../models/address.model');

const createAddress = catchAsync(async (req, res) => {
  const address = await Address.create({
    user: req.user._id,
    phoneNumber: req.body.phoneNumber,
    recipientName: req.body.recipientName,
    detailAddress: req.body.detailAddress,
  });

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo mới địa chỉ giao hàng thành công',
    data: {
      address,
    },
  });
});

const getListAddresses = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt:desc' } = req.query;

  const skip = (+page - 1) * +limit;
  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const [addresses, totalResults] = await Promise.all([
    Address.find({ user: req.user._id }).sort(sort).skip(skip).limit(+limit),
    Address.countDocuments({ user: req.user._id }),
  ]);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách địa chỉ giao hàng thành công',
    data: {
      addresses,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getAddressById = catchAsync(async (req, res) => {
  const address = await Address.findOne({
    user: req.user._id,
    _id: req.params.addressId,
  });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy địa chỉ giao hàng');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin địa chỉ giao hàng thành công',
    data: {
      address,
    },
  });
});

const updateAddressById = catchAsync(async (req, res) => {
  const address = await Address.findOne({
    user: req.user._id,
    _id: req.params.addressId,
  });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy địa chỉ giao hàng');
  }

  Object.assign(address, req.body);
  await address.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin địa chỉ giao hàng thành công',
    code: httpStatus.OK,
    data: {
      address,
    },
  });
});

const deleteAddressById = catchAsync(async (req, res) => {
  const address = await Address.findOneAndDelete({
    user: req.user._id,
    _id: req.params.addressId,
  });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy địa chỉ giao hàng');
  }

  res.status(httpStatus.OK).json({
    message: 'Xoá địa chỉ giao hàng thành công',
    code: httpStatus.OK,
    data: {
      address,
    },
  });
});

module.exports = {
  createAddress,
  getAddressById,
  getListAddresses,
  updateAddressById,
  deleteAddressById,
};
