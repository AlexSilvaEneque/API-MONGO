const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products.controller')
const { upload } = require('../middleware/expres-fileupload')
const verifyRole = require('../middleware/verify-role')
const verifyToken = require('../middleware/verify-token')

const productController = new ProductController

router.get('/', productController.readAll)

router.get('/:id', productController.readById)

router.post('/', upload, verifyToken, verifyRole, productController.saveProduct)

router.put('/:id', upload, verifyToken, verifyRole, productController.updateProduct)

router.delete('/:id', verifyToken, verifyRole, productController.deleteProduct)

router.get('/resolve/count', verifyToken, verifyRole, productController.countProducts)

router.get('/resolve/featured', verifyToken, verifyRole, productController.readFeatured)

module.exports = router