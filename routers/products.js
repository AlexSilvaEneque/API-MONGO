const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products.controller')

const productController = new ProductController

router.get('/', productController.readAll)

router.get('/:id', productController.readById)

router.post('/', productController.saveProduct)

router.put('/:id', productController.updateProduct)

router.delete('/:id', productController.deleteProduct)

router.get('/resolve/count', productController.countProducts)

router.get('/resolve/featured', productController.readFeatured)

module.exports = router