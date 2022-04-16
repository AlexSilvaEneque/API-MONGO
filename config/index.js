const dotenv = require('dotenv')

dotenv.config()

const config = {
    port: process.env.PORT,
    prefix: process.env.PREFIX,
    connection_string: process.env.CONNECTION_STRING
}

module.exports = config