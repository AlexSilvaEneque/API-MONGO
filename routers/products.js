const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products.controller')
const { upload } = require('../middleware/expres-fileupload')
const verifyRole = require('../middleware/verify-role')

const productController = new ProductController

router.get('/', productController.readAll)

router.get('/:id', productController.readById)

router.post('/', upload, productController.saveProduct)


// TODO: add upload
router.put('/:id', upload, productController.updateProduct)

router.delete('/:id', productController.deleteProduct)

router.get('/resolve/count', productController.countProducts)

router.get('/resolve/featured', productController.readFeatured)

module.exports = router