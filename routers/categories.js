const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/categories.controller')

const categoryController = new CategoryController

router.get('/', categoryController.readAll)

router.get('/:id', categoryController.readById)

router.post('/', categoryController.saveCategory)

router.put('/:id', categoryController.updateCategory)

router.delete('/:id', categoryController.deleteCategory)

module.exports = router