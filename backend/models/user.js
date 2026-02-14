const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    adharCardNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{12}$/, 'Adhar Card Number must be 12 digits']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVoted: {
        type: Boolean,
        default: false,
    },
},);

const User = mongoose.model('User', UserSchema);
module.exports = User;