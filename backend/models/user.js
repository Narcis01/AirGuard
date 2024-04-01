const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Enter username'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Enter password'],
        select: false
    }
});
//Encrypt password
userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10);
})

//Get JWT
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP
    });
}
//Compare 2 passwords
userSchema.methods.comparePassword = async function(inputPassword){
    return await bcrypt.compare(inputPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);