const { api_key, api_secret, cloud_name } = require('../config')
const cloudinary = require('cloudinary').v2


cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true
})

const uploadImage = async function (filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'photosMongo'
    })
}

module.exports = { uploadImage }