const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    detailAddress: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
