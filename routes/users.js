const userRoutes = require('express').Router();
const { getUserInfo, updateUserProfile } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validations');

userRoutes.get('/me', getUserInfo);
userRoutes.patch('/me', updateUserValidation, updateUserProfile);

module.exports = userRoutes;
