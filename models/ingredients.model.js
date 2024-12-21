const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      require: true,
    },
    nutritionalValue: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: false,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Suppliers',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
    },
  },
  { timestamps: true },
);

const Ingredients = mongoose.model('Ingredients', ingredientsSchema);

module.exports = Ingredients;
