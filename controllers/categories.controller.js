const Category = require("../models/category.model")

class CategoryController {
    async readAll(req, res) {
        try {
            const categoryList = await Category.find()
            if (!categoryList) {
                return res.status(500).json({success: false})
            }
            return res.status(200).send(categoryList)
        } catch (error) {
            console.log(error)
        }
    }

    async readById(req, res) {
        const idCategory = req.params.id
        try {
            let category = await Category.findById(idCategory)
            if (!category)
                return res.status(500).json({message: 'Category not found',success: false})
        
            return res.status(200).send(category)
        } catch (error) {
            console.log(error)
        }
    }

    async saveCategory(req, res) {
        let category = new Category({
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon
        })
    
        try {
            category = await category.save()
            if (!category)
                return res.status(500).json({message: 'The category cannot be created!'})
            return res.status(200).send(category)
        } catch (error) {
            return res.status(400).json(error)
        }
    }

    async updateCategory(req, res) {
        const idCategory = req.params.id
        try {
            let category = await Category.findByIdAndUpdate(idCategory,
                {
                    name: req.body.name,
                    color: req.body.color,
                    icon: req.body.icon
                },
                { new: true }
            )
            if (!category)
                return res.status(400).json({message: 'Failed top update!'})
            return res.status(201).send({category, succes: true})
        } catch (error) {
            console.log(error)
        }
    }

    async deleteCategory(req, res) {
        let id = req.params.id
        try {
            let categoryDeleted = await Category.findByIdAndDelete(id)
        
            if (!categoryDeleted) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found'
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: 'Category deleted!'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CategoryController