const mongoose = require('mongoose');
const dataRaspberry = mongoose.Schema({
    temperature: {
        type: Number,
        require: [true, 'Enter the temperature']
    },
    co2: {
        type: Number,
        require: [true, 'Enter the co2']
    },
    humidity: {
        type: Number,
        require: [true, 'Enter the humidity']
    },
    light: {
        type: Number,
        require: [true, 'Enter the light in lux']
    },
    dust: {
        type: Number,
        require: [true, 'Enter dust particles']
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
});

module.exports = mongoose.model("Data", dataRaspberry);