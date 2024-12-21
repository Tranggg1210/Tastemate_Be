const SALT_WORK_FACTOR = 10;

const USER_ROLE_ENUM = {
  USER: 'user',
  ADMIN: 'admin',
  SHIPPER: 'shipper',
};

const ORDER_STATUS_ENUM = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

module.exports = {
  USER_ROLE_ENUM,
  SALT_WORK_FACTOR,
  ORDER_STATUS_ENUM,
};
