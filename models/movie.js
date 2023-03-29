const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильны формат ссылки!',
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильны формат ссылки!',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильны формат ссылки!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
