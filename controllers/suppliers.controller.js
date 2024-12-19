const httpStatus = require('http-status');
const Suppliers = require('../models/suppliers.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createSuppliers = catchAsync(async (req, res) => {

  const newSupplier = await Suppliers.create(req.body);

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Tạo mới nhà cung cấp thành công',
    data: {
      newSupplier,
    },
  });
});

const getSuppliers = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt : desc, name: desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const suppliers = await Suppliers.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await Suppliers.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách nhà cung cấp thành công',
    data: {
      suppliers,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getSupplierById = catchAsync(async (req, res) => {
  const supplierId = req.params.supplierId;

  const supplier = await Suppliers.findById(supplierId);

  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhà cung cấp');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin nhà cung cấp thành công',
    data: {
      supplier,
    },
  });
});

const updateSupplierById = catchAsync(async (req, res) => {
  const supplier = await Suppliers.findById(req.params.supplierId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhà cung cấp');
  }
  Object.assign(supplier, req.body);

  await supplier.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin nhà cung cấp thành công',
    code: httpStatus.OK,
    data: {
      supplier,
    },
  });
});

const deleteSupplierById = catchAsync(async (req, res) => {
  const supplier = await Suppliers.findByIdAndDelete(req.params.supplierId);

  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy nhà cung cấp`);
  }

  res.status(httpStatus.OK).json({
    message: `Xoá nhà cung cấp thành công`,
    code: httpStatus.OK,
    data: {
      supplier,
    },
  });
});


module.exports = {
  createSuppliers,
  getSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById
};
