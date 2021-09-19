const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 64
    },
    email: {
        type: String,
        min: 3,
        max: 64
    },
    password: {
        type: String,
        min: 3,
        max: 64
    }
});

const user  =  mongoose.model('user', userSchema)
module.exports = user