const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/categories.controller')
const verifyRole = require('../middleware/verify-role')
const verifyToken = require('../middleware/verify-token')

const categoryController = new CategoryController

router.get('/', verifyToken, categoryController.readAll)

router.get('/:id', verifyToken, verifyRole, categoryController.readById)

router.post('/', verifyToken, verifyRole, categoryController.saveCategory)

router.put('/:id', verifyToken, verifyRole, categoryController.updateCategory)

router.delete('/:id', verifyToken ,verifyRole, categoryController.deleteCategory)

module.exports = router