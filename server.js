const express = require('express')
const { port, connection_string, prefix } = require('./config')
const mongoose = require('mongoose')
const cors = require('cors')
const productRouter = require('./routers/products')
const categoryRouter = require('./routers/categories')
const userRouter = require('./routers/users')
const orderRouter = require('./routers/orders')

const app = express()

const corsOptions = {
    origin: 'http://localhost:4000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

app.use(`${prefix}/products`, productRouter)
app.use(`${prefix}/categories`, categoryRouter)
app.use(`${prefix}/users`, userRouter)
app.use(`${prefix}/orders`, orderRouter)


mongoose.connect(connection_string)
    .then(()=>{
        console.log('Connection ready!')
    })
    .catch(error => {
        console.log(error)
    })

app.listen(port, () => {
    console.log(`... http://localhost:${port} 😎😎😎😎`)
})