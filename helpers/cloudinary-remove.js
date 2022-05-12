const { cloud_name, api_key, api_secret } = require('../config')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true
})

const removeFile = async (public_id) => {
    return await cloudinary.uploader.destroy(public_id)
}

module.exports = removeFile