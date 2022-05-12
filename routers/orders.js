const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/orders.controller')

const orderController = new OrderController

router.get('/', orderController.readAll)

router.get('/:id', orderController.readById)

router.post('/' , orderController.saveOrder)

router.put('/:id', orderController.updateOrder)

router.delete('/:id', orderController.deleteOrder)

router.get('/get/totalsale', orderController.totalSale)

router.get('/get/count', orderController.sales)

router.get('/userorder/:userid', orderController.userorder)

module.exports = router