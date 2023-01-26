const movieRoutes = require('express').Router();
const { getMovies, postMovies, deleteMovie } = require('../controllers/movies');
const { createFilmValidation, filmIdValidation } = require('../middlewares/validations');

movieRoutes.get('/', getMovies);

movieRoutes.post('/', createFilmValidation, postMovies);

movieRoutes.delete('/movieId', filmIdValidation, deleteMovie);

module.exports = movieRoutes;
