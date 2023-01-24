const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUserProfile } = require('../controllers/users');

userRoutes.get('/me', getUserInfo);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().email(),
  }),
}), updateUserProfile);

module.exports = userRoutes;
