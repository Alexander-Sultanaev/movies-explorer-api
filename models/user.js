const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильны формат почты',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
