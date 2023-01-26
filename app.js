const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorHandler = require('./errors/ErrorHandler');
const handlerCORS = require('./middlewares/handlerCORS');
const {
  PORT, NODE_ENV, MONGO_URL, MONGO_URL_DEV,
} = require('./utils/constants');
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(handlerCORS);
app.use('/', routes);
app.use(errors());
app.use(errorHandler);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});
