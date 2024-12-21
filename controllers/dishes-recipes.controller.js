const httpStatus = require('http-status');
const Dishes = require('../models/dishes.model');
const DishesRecipes = require('../models/dishes-recipes.model');
const Ingredients = require('../models/ingredients.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createDishesRecipes = catchAsync(async (req, res) => {
  const { dishes, ingredients, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số lượng nguyên liệu không hợp lệ');
  }

  const dishesFind = await Dishes.findById(dishes);
  if (!dishesFind) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy món ăn');
  }

  const ingredientFind = await Ingredients.findById(ingredients);
  if (!ingredientFind) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu');
  }

  await DishesRecipes.create({
    dishes,
    ingredients,
    quantity,
  });

  try {
    dishesFind.nutritionalValue += quantity * ingredientFind.nutritionalValue;
    await dishesFind.save();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi khi cập nhật giá trị dinh dưỡng');
  }

  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: `Đã thêm nguyên liệu ${ingredientFind.name} vào món ăn ${dishesFind.name} thành công`,
    data: {
      dishesFind,
      ingredients: [
        {
          _id: ingredientFind._id,
          name: ingredientFind.name,
          nutritionalValue: ingredientFind.nutritionalValue,
          quantity,
        },
      ],
    },
  });
});

const getDishesRecipesByDishesId = catchAsync(async (req, res) => {
  const dishesId = req.params.dishesId;

  const dishesRecipes = await DishesRecipes.find({ dishes: dishesId });
  const dishes = await Dishes.findById(dishesId);

  const ingredientIds = dishesRecipes.map((recipe) => recipe.ingredients);

  const ingredients = await Ingredients.find({ _id: { $in: ingredientIds } });

  const formattedRecipes = dishesRecipes.map((recipe) => {
    const ingredient = ingredients.find((ing) => ing._id.toString() === recipe.ingredients.toString());
    return {
      _id: recipe._id,
      quantity: recipe.quantity,
      ingredientInfo: ingredient,
    };
  });

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin các nguyên liệu của món ăn thành công',
    data: {
      dishes,
      ingredients: formattedRecipes,
    },
  });
});

const updateDishesRecipesById = catchAsync(async (req, res) => {
  const { ingredients, quantity } = req.body;

  const dishesRecipes = await DishesRecipes.findById(req.params.dishesRecipesId);
  if (!dishesRecipes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu món ăn');
  }

  const dishes = await Dishes.findById(dishesRecipes.dishes);
  if (!dishes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy món ăn');
  }

  const oldIngredient = await Ingredients.findById(dishesRecipes.ingredients);
  dishes.nutritionalValue -= dishesRecipes.quantity * oldIngredient.nutritionalValue;

  if (ingredients) {
    const newIngredient = await Ingredients.findById(ingredients);
    if (!newIngredient) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nguyên liệu mới');
    }
    dishesRecipes.ingredients = ingredients;

    if (quantity) {
      dishes.nutritionalValue += quantity * newIngredient.nutritionalValue;
    } else {
      dishes.nutritionalValue += dishesRecipes.quantity * newIngredient.nutritionalValue;
    }
  } else if (quantity) {
    dishes.nutritionalValue += quantity * oldIngredient.nutritionalValue;
  }

  if (quantity) {
    dishesRecipes.quantity = quantity;
  }

  await dishesRecipes.save();
  await dishes.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin nguyên liệu của món ăn thành công',
    code: httpStatus.OK,
    data: {
      dishesRecipes,
    },
  });
});

const deleteDishesRecipesById = catchAsync(async (req, res) => {
  const dishesRecipes = await DishesRecipes.findByIdAndDelete(req.params.dishesRecipesId);
  if (!dishesRecipes) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy nguyên liệu món ăn`);
  }

  const dishesFind = await Dishes.findById(dishesRecipes.dishes);
  const ingredientFind = await Ingredients.findById(dishesRecipes.ingredients);
  dishesFind.nutritionalValue -= dishesRecipes.quantity * ingredientFind.nutritionalValue;

  res.status(httpStatus.OK).json({
    message: `Xoá nguyên liệu ra khỏi món ăn thành công`,
    code: httpStatus.OK,
    data: {
      dishesRecipes,
    },
  });
});

module.exports = {
  createDishesRecipes,
  getDishesRecipesByDishesId,
  updateDishesRecipesById,
  deleteDishesRecipesById,
};
