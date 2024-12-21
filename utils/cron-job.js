const Order = require('../models/order.model');
const { ORDER_STATUS_ENUM } = require('../constants');

const workflowCronJob = [
  {
    oldStatus: ORDER_STATUS_ENUM.DELIVERING,
    newStatus: ORDER_STATUS_ENUM.COMPLETED,
    action: 'completed',
    description: 'Đơn hàng đã được giao thành công',
  },
  {
    oldStatus: ORDER_STATUS_ENUM.CONFIRMED,
    newStatus: ORDER_STATUS_ENUM.DELIVERING,
    action: 'delivering',
    description: 'Đơn hàng đang được giao',
  },
  {
    oldStatus: ORDER_STATUS_ENUM.PENDING,
    newStatus: ORDER_STATUS_ENUM.CONFIRMED,
    action: 'confirmed',
    description: 'Đơn hàng đã được xác nhận',
  },
];

const updateStatusOrder = async () => {
  const now = new Date();
  console.log(`[CRON JOB] Update status order at ${now.toLocaleTimeString()}`);

  const bulkWrite = workflowCronJob.map((item) => ({
    updateOne: {
      filter: { status: item.oldStatus },
      update: {
        $set: { status: item.newStatus },
        $push: {
          histories: {
            action: item.action,
            description: item.description,
          },
        },
      },
    },
  }));

  await Order.bulkWrite(bulkWrite);
  console.log('[CRON JOB] Update status order successfully');
};

module.exports = { updateStatusOrder };
