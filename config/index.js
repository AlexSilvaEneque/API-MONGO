const dotenv = require('dotenv')

dotenv.config()

const config = {
    port: process.env.PORT,
    prefix: process.env.PREFIX,
    connection_string: process.env.CONNECTION_STRING,
    secret_string: process.env.SECRET,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
}

module.exports = config