const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, deleteUser } = require('../controllers/authController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(isAuthenticatedUser,logout);
router.route('/user/delete/:id').delete(deleteUser);

module.exports = router;