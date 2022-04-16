const mongoose = require('mongoose')

const { Schema } = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: String,
    icon: String
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category