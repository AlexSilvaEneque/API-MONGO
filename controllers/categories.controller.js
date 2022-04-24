const Category = require("../models/category.model")

class CategoryController {
    async readAll(req, res) {
        try {
            const categoryList = await Category.find()
            if (!categoryList) {
                throw new Error('Empty collection!')
            }
            return res.status(200).json({ categoryList, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async readById(req, res) {        
        try {
            const idCategory = req.params.id
            let category = await Category.findById(idCategory)
            if (!category) {
                throw new Error('Category not found!')
            }
            return res.status(200).json({ category, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async saveCategory(req, res) {
        try {
            let category = new Category({
                name: req.body.name,
                color: req.body.color,
                icon: req.body.icon
            })

            category = await category.save()

            if (!category) {
                throw new Error('The category cannot be created!')
            }
            return res.status(200).json({ category, success: true })
        } catch (error) {
            return res.status(400).json({ message: error.message, success: false })
        }
    }

    async updateCategory(req, res) {        
        try {
            const idCategory = req.params.id
            let category = await Category.findByIdAndUpdate(idCategory,
                {
                    name: req.body.name,
                    color: req.body.color,
                    icon: req.body.icon
                },
                { new: true }
            )
            if (!category) {
                throw new Error('Failed top update!')
            }
            return res.status(201).send({ category, succes: true })
        } catch (error) {
            return res.status(400).json({ message: error.message, success: false })
        }
    }

    async deleteCategory(req, res) {        
        try {
            const id = req.params.id
            let categoryDeleted = await Category.findByIdAndDelete(id)
        
            if (!categoryDeleted) {
                throw new Error('Category not found!')
            }
            else {
                return res.status(200).json({ message: 'Category deleted!', success: true })
            }
        } catch (error) {
            return res.status(400).json({ message: error.message, success: false })
        }
    }
}

module.exports = CategoryController