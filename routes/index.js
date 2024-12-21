const express = require('express');

const apiRoute = express.Router();

const listRoutesApi = [
  {
    path: '/users',
    route: require('./user.route'),
  },
  {
    path: '/auth',
    route: require('./auth.route'),
  },
  {
    path: '/addresses',
    route: require('./address.route'),
  },
  {
    path: '/categories',
    route: require('./category.route'),
  },
  {
    path: '/suppliers',
    route: require('./supplier.route'),
  },
  {
    path: '/ingredients',
    route: require('./ingredients.route'),
  },
  // @Todo add new route here
];

listRoutesApi.forEach((route) => {
  apiRoute.use(route.path, route.route);
});

module.exports = apiRoute;
