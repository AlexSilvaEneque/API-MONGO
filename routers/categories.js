const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/categories.controller')
const verifyRole = require('../middleware/verify-role')

const categoryController = new CategoryController

router.get('/', verifyRole, categoryController.readAll)

router.get('/:id', verifyRole, categoryController.readById)

router.post('/', verifyRole, categoryController.saveCategory)

router.put('/:id', verifyRole, categoryController.updateCategory)

router.delete('/:id', verifyRole, categoryController.deleteCategory)

module.exports = router