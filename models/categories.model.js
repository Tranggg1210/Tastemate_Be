const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534944645004-bf75556ce377?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
  { timestamps: true },
);

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
