const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      require: true,
    },
    nutritionalValue: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    }
  },
  { timestamps: true },
);

const Ingredients = mongoose.model('Ingredients', ingredientsSchema);

module.exports = Ingredients;
