const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { privateKey } = require('../../react-mesto-api-full/backend/middlewares/auth');

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).orFail(() => new NotFoundError('Ошибка 404. Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, { name, email }, {
      new: true,
      runValidators: true,
    }).orFail(() => new NotFoundError('Ошибка 404. Пользователь не найден'));
    return res.json(updateUser);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при изменении данных'));
    }
    if (err.code === 11000) {
      return next(new ConflictError('Ошибка 409. Пользователь c такой почтой уже существует'));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    return res.send({
      name: user.name,
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return next(new ConflictError('Ошибка 409. Пользователь c такой почтой уже существует'));
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user === null) {
      return next(new UnauthorizedError('Ошибка 401. Переданы некорректные данные email или пароля'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError('Ошибка 401. Переданы некорректные данные email или пароля'));
    }
    const token = jwt.sign({ _id: user._id }, privateKey, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports = {
  getUserInfo,
  updateUserProfile,
  createUser,
  login,
};
