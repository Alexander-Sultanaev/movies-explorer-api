const routes = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const NotFoundError = require('../errors/NotFoundError');
const { signUp, signIn } = require('../middlewares/validations');

routes.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

routes.post('/signin', signIn, login);
routes.post('/signup', signUp, createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);
routes.use('*', (req, res, next) => next(new NotFoundError('Ошибка 404. Страница не найдена')));

module.exports = routes;
