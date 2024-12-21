const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nutritionalValue: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534944645004-bf75556ce377?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    },
    unit: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
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
    }
  },
  { timestamps: true },
);

const Ingredients = mongoose.model('Ingredients', ingredientsSchema);

module.exports = Ingredients;
