const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
const bodyDataHas = require("../utils/bodyDataHas");

// Validation Middleware Functions

// Price is valid
function priceIsValid(request, response, next) {
  const { data: { price } = {} } = request.body;
  if (price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  next();
}
// Dish exists
function dishExists(request, response, next) {
  const { dishId } = request.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    response.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist ${dishId}`,
  });
}
// Dish Id is valid if present
function dishIdIsValidIfPresent(request, response, next) {
  const { dishId } = request.params;
  const { data: { id } = {} } = request.body;
  if (id) {
    if (id === dishId) {
      return next();
    } else {
      return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
    }
  }
  return next();
}
// CRUDL Functions
// List function
function list(request, response, next) {
  response.json({ data: dishes });
}
// Create function
function create(request, response, next) {
  const { data: { name, description, price, image_url } = {} } = request.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  response.status(201).json({ data: newDish });
}

// Read function
function read(request, response, next) {
  response.json({ data: response.locals.dish });
}
// Update function
function update(request, response, next) {
  const dish = response.locals.dish;
  const {
    data: { name, description, price, image_url },
  } = request.body;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  response.json({ data: dish });
}

// EXPORTS
module.exports = {
  list,
  create: [
    bodyDataHas("name", "Dish"),
    bodyDataHas("description", "Dish"),
    bodyDataHas("price", "Dish"),
    bodyDataHas("image_url", "Dish"),
    priceIsValid,
    create,
  ],
  read: [dishExists, read],
  update: [
    dishExists,
    dishIdIsValidIfPresent,
    bodyDataHas("name", "Dish"),
    bodyDataHas("description", "Dish"),
    bodyDataHas("price", "Dish"),
    bodyDataHas("image_url", "Dish"),
    priceIsValid,
    update,
  ],
};
