const Order = require("../models/order.model")
const OrderItem = require("../models/orderItems")

class OrderController {
    async readAll(req, res) {
        try {

            // TODO: estamos ordenando por fecha del más reciente al más antiguo
            //const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})

            const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})

            if (!orderList) {
                throw new Error('Empty collection!')                
            }
            return res.status(200).json({ orderList, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async readById(req, res) {
        try {
            const order = await Order.findById(req.params.id)
                .populate('user', 'name')
                .populate({ path: 'orderItems', 
                    populate: { 
                        path: 'product', populate: 'category' 
                    }
                })

            if (!order) {
                throw new Error('The order not found!')
            }
            return res.status(200).json({ order, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async saveOrder(req, res) {
        try {
            const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product
                })

                newOrderItem = await newOrderItem.save()

                return newOrderItem._id
            }))

            const itemIdsResolve = await orderItemsIds

            const totalPrices = await Promise.all(itemIdsResolve.map(async orderItemId => {
                const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
                const totalPrice = orderItem.product.price * orderItem.quantity
                return totalPrice
            }))

            const totalPrice = totalPrices.reduce((a,b) => a+b, 0)

            let order = new Order({
                orderItems: itemIdsResolve,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice: totalPrice,
                user: req.body.user
            })
            order = await order.save()

            if (!order) {
                throw new Error('The order cannot be created!')
            }

            return res.status(200).json({ order, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async updateOrder(req, res) {
        try {
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status
                },
                { new: true }
            )
    
            if (!order) {
                throw new Error('Failed operation!')                
            }
            return res.status(201).json({ order, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async deleteOrder(req, res) {
        try {
            const idOrder = req.params.id
            const order = await Order.findByIdAndDelete(idOrder)

            if (order) {
                order.orderItems.map(async idItem => {
                    await OrderItem.findByIdAndDelete(idItem)
                })
                return res.status(200).json({ message: 'Order deleted!', success: true })
            } else {
                throw new Error('Order not found!')
            }
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async totalSale(req, res) {
        try {
            const totalSales = await Order.aggregate([
                { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
            ])

            if (!totalSales) {
                throw new Error('The order sales cannot be generated!')
            }
            return res.status(200).json({ total: totalSales.pop().totalsales , success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async sales(req, res) {
        try {
            const orderCount = await Order.countDocuments()
            if (!orderCount) {
                throw new Error('Empty collection!')
            }
            return res.status(200).json({ orderCount, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async userorder(req, res) {
        try {
            const userOrderList = await Order.find({ user: req.params.userid })
                .populate({
                    path: 'orderItems', populate: {
                        path: 'product', populate: 'category'
                    }
                }).sort({ 'dateOrdered': -1 })
            if (!userOrderList) {
                throw new Error('Empty collection!')
            }
            return res.status(200).json({ userOrderList, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }
}

module.exports = OrderController