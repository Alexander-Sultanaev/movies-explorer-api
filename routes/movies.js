const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, postMovies, deleteMovie } = require('../controllers/movies');

const regexUrl = (/(http|https):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+)/);
movieRoutes.get('/', getMovies);

movieRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexUrl),
    trailerLink: Joi.string().required().regex(regexUrl),
    thumbnail: Joi.string().required().regex(regexUrl),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovies);

movieRoutes.delete('/movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().required()
      .length(24),
  }),
}), deleteMovie);

module.exports = movieRoutes;
