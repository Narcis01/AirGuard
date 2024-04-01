const mongoose = require('mongoose');

const AdressSchema = mongoose.Schema({
    location: {
        type: String,
        required: [true, 'Enter the location']
    },
    room: {
        type: String,
        required: [true, 'Enter the room']
    }
})


module.exports = mongoose.model('Address', AdressSchema);