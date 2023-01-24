const Movies = require('../models/movie');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movies.find({});
    return res.json(movies);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const postMovies = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
      _id,
    } = await Movies.create({
      country: req.body.country,
      director: req.body.director,
      duration: req.body.duration,
      year: req.body.year,
      description: req.body.description,
      image: req.body.image,
      trailerLink: req.body.trailerLink,
      thumbnail: req.body.thumbnail,
      owner: req.user._id,
      movieId: req.body.movieId,
      nameRU: req.body.nameRU,
      nameEN: req.body.nameEN,
    });
    return res.json({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: { _id: owner },
      movieId,
      nameRU,
      nameEN,
      _id,
    });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при добавлении фильма'));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;
    const movies = await Movies.findById(movieId).populate('owner').orFail(() => new NotFoundError('Ошибка 404. Фильм не найден'));
    const ownerId = movies.owner._id.toString();
    if (ownerId !== userId) {
      return next(new ForbiddenError('Ошибка 403. Недостаточно прав.'));
    }
    await Movies.findByIdAndRemove(movieId);
    return res.json({ message: 'Фильм успешно удален' });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректный _id удаляемого фильма'));
    }
    return next(err);
  }
};

module.exports = {
  getMovies,
  postMovies,
  deleteMovie,
};
