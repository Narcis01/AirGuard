const DataRaspberry = require('../models/dataRaspberry');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

/**
 * Return data for a given interval or all the data 
 */
exports.getData = catchAsyncErrors(async (req, res, next) => {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var addressId = req.params.id;
    console.log(addressId);
    console.log(startDate);
    console.log(endDate);
    if (startDate && endDate) {
        const data = await DataRaspberry.find({
            date: {
                $gte: startDate,
                $lte: endDate
            },
            address: addressId
        });
        return res.status(200).json(
            {
                message: data
            }
        );
    }
    else {
        const data = await DataRaspberry.find({
            address: addressId
        });
        return res.status(200).json(
            {
                message: data
            }
        );
    }
});


exports.postData = catchAsyncErrors(async (req, res, next) => {
    const dataRespberry = await DataRaspberry.create(req.body);

    return res.status(200).json(
        {
            message: "data saved",
            data: dataRespberry
        }
    )
});

exports.deleteData = catchAsyncErrors(async (req, res, next) => {
    await DataRaspberry.findByIdAndDelete({ _id: req.params.id })
    return res.status(200).json(
        {
            message: "Data deleted"
        }
    )
});

exports.updateData = catchAsyncErrors(async (req, res, next) => {
    let data = await DataRaspberry.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,

    });

    return res.status(200).json({
        message: "Data updated",
        data: data
    })

});

exports.resetData = catchAsyncErrors(async (req, res, next) => {
    var addressId = req.params.id;

    if(!addressId){
        return next(new ErrorHandler('Address ID is required', 400));
    }

    await DataRaspberry.deleteMany({ address: addressId });
    return res.status(200).json({
        message: "Reset"
    });
});