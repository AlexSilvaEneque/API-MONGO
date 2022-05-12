const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/orders.controller')
const verifyRole = require('../middleware/verify-role')
const verifyToken = require('../middleware/verify-token')

const orderController = new OrderController

router.get('/', verifyToken, verifyRole ,orderController.readAll)

router.get('/:id', verifyToken, verifyRole, orderController.readById)

router.post('/' , verifyToken, orderController.saveOrder)

router.put('/:id', orderController.updateOrder)

router.delete('/:id', orderController.deleteOrder)

router.get('/get/totalsale', verifyToken, verifyRole, orderController.totalSale)

router.get('/get/count', verifyToken, verifyRole, orderController.sales)

router.get('/userorder/:userid', orderController.userorder)

module.exports = router