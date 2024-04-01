const Address = require('../models/address');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const dataRaspberry = require('../models/dataRaspberry');

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
    const { location, room } = req.body;

    if (!location || !room) {
        return next(new ErrorHandler('No location or room', 400));
    }

    const address = await Address.create({
        location,
        room
    });

    return res.status(200).json({
        address
    })
});

exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        next(new ErrorHandler('No id', 400));
    }
    // Delete all the data that was for the selected room
    await dataRaspberry.deleteMany({ address: id});
    await Address.findByIdAndDelete({ _id: id });

    return res.status(200).json({
        message: 'Address deleted'
    });
});

exports.getAllAddresses = catchAsyncErrors(async (req, res) => {
    const data = await Address.find();

    return res.status(200).json({ data })
});

exports.updateAddress = catchAsyncErrors( async (req, res) => {
    let data = await Address.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    return res.status(200).json({
        message: "Address updated",
        address: data
    });
});

