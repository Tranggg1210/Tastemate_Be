const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const suppliersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true
    },
    address: {
      type: String,
      require: true
    }
  },
  { timestamps: true },
);

const Suppliers = mongoose.model('Suppliers', suppliersSchema);

module.exports = Suppliers;
