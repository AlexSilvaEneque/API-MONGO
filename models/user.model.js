const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    street: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    expirationDate: {
        type: Number,
        required: true,
        default: new Date().getTime() / 1000
    },
    emailToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User