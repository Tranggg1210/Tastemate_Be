const httpStatus = require('http-status');

const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../configs/cloudinary.config');

const createUser = catchAsync(async (req, res) => {
  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    throw new ApiError(httpStatus.CONFLICT, 'Email đã tồn tại');
  }

  const user = await User.create(req.body);

  const file = req.file;
  if (file) {
    try {
      const avatar = await cloudinary.uploader.upload(file.path);
      user.avatar = avatar.url;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi upload avatar');
    }
  }

  await Promise.all([user.save(), Cart.create({ user: user._id })]);

  user.password = undefined;

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo người dùng thành công',
    data: {
      user,
    },
  });
});

const getUsers = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt : desc, fullname: desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const users = await User.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await User.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách người dùng thành công',
    data: {
      users,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin người dùng thành công',
    data: {
      user,
    },
  });
});

const updateUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
  }
  Object.assign(user, req.body);

  const file = req.file;
  if (file) {
    const avatar = await cloudinary.uploader.upload(file.path);
    user.avatar = avatar.url;
  }

  await user.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin người dùng thành công',
    code: httpStatus.OK,
    data: {
      user,
    },
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy người dùng`);
  }

  res.status(httpStatus.OK).json({
    message: `Xoá người dùng thành công`,
    code: httpStatus.OK,
    data: {
      user,
    },
  });
});

const lockUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy người dùng`);
  }
  user.isLocked = !user.isLocked;
  await user.save();

  return res.status(httpStatus.OK).json({
    message: user.isLocked ? 'Khoá người dùng thành công' : 'Mở khoá người dùng thành công',
    code: httpStatus.OK,
    data: {
      user,
    },
  });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  lockUserById,
};
