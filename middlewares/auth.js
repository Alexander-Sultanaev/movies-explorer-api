/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

let privateKey;
if (NODE_ENV === 'production') {
  privateKey = JWT_SECRET;
} else {
  privateKey = 'dev-secret';
}
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Ошибка 401. Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, privateKey);
  } catch (err) {
    return next(new UnauthorizedError('Ошибка 401. Необходима авторизация'));
  }

  req.user = payload;
  next();
};

module.exports = { auth, privateKey };
