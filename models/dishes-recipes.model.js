const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dishesRecipesSchema = new Schema({
  dishes: {
    type: Schema.Types.ObjectId,
    ref: 'Dishes',
  },
  ingredients: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredients',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const DishesRecipes = mongoose.model('DishesRecipes', dishesRecipesSchema);

module.exports = DishesRecipes;
