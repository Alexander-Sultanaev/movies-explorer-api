const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const NotFoundError = require('../errors/NotFoundError');

routes.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);
routes.use('*', (req, res, next) => next(new NotFoundError('Ошибка 404. Страница не найдена')));

module.exports = routes;
