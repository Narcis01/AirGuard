const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const catchAsyncErros = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
/**
 * Create new user
 */
exports.registerUser = catchAsyncErros(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler('No username or password', 400));
    }

    const user = await User.create({
        username,
        password
    });

    res.status(200).json({
        user
    });
});

/**
 * Login user
 */
exports.loginUser = catchAsyncErros(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler('No username or password', 400));
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid username', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
        sendToken(user, 200, res);
    }

    next(new ErrorHandler('Invalid password', 401));

});
/**
 * Logout the user
 */
exports.logout = catchAsyncErros(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        message: 'Logged out'
    });
});


exports.deleteUser = catchAsyncErros(async (req, res, next) => {
    await User.findByIdAndDelete({ _id: req.params.id });

    res.status(200).json({
        message: 'User deleted'
    });
});