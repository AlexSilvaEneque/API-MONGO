const mongoose = require("mongoose")
const fs = require('fs-extra')
const { uploadImage } = require("../helpers/cloudinary-upload")
const Category = require("../models/category.model")
const Product = require("../models/product.model")
const removeFile = require("../helpers/cloudinary-remove")

class ProductController {
    async readAll(req, res) {
        try {
            let filter = {}

            if (req.query.categories) {
                filter = {category: req.query.categories.split(',')}
            }
        
            const productList = await Product.find(filter)
        
            const countList = await Product.find(filter).countDocuments()
        
            if (!productList) {
                throw new Error('Empty collection!')
            }        
            return res.status(200).json({ productList, countList })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    } 

    async readById(req, res) {
        try {
            const idProduct = req.params.id
            const product = await Product.findById(idProduct).populate('category')

            if (!product) {
                throw new Error('The product not found!')
            }
            return res.status(200).json({ product, success: true })            
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async saveProduct(req, res) {
        try {
            const category = await Category.findById(req.body.category)
            if (!category) {
                throw new Error('The category not exists!')
            }

            const file = req.files
            if (!file) {
                throw new Error('No image in the request!')
            }
            
            const fileName = req.files.image.tempFilePath

            const resultImage = await uploadImage(fileName)
        
            let product = new Product({
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: {
                    public_id: resultImage.public_id,
                    secure_url: resultImage.secure_url                    
                },
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,        
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            })

            await fs.unlink(fileName)
            
            product = await product.save()
            if (!product) {
                throw new Error('The product cannot be created!')
            }
            return res.status(200).json({ product, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async updateProduct(req, res) {
        try {
            const idProduct = req.params.id
            if (!mongoose.isValidObjectId(idProduct)) {
                throw new Error('Invalid Product Id')
            }
        
            const category = await Category.findById(req.body.category)
            if (!category) {
                throw new Error('The category not exists!')
            }

            const product = await Product.findById(idProduct)
            if (!product) {
                throw new Error('No product!')
            }

            const file = req.files
            let fileName = product.image

            if (file) {
                await removeFile(product.image.public_id)        
                fileName = await uploadImage(file.image.tempFilePath)
            }

            let updatedProduct = await Product.findByIdAndUpdate(idProduct,
                {
                    name: req.body.name,
                    description: req.body.description,
                    richDescription: req.body.richDescription,
                    image: {
                        public_id: fileName.public_id,
                        secure_url: fileName.secure_url
                    },
                    brand: req.body.brand,
                    price: req.body.price,
                    category: req.body.category,        
                    countInStock: req.body.countInStock,
                    rating: req.body.rating,
                    numReviews: req.body.numReviews,
                    isFeatured: req.body.isFeatured
                },
                { new: true }
            )
            
            await fs.unlink(file.image.tempFilePath)
    
            if (!updatedProduct) {
                throw new Error('Failed top update!')
            }
            return res.status(201).send({ updatedProduct, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async deleteProduct(req, res) {        
        try {
            const id = req.params.id
            let productDeleted = await Product.findByIdAndDelete(id)
    
            if (!productDeleted) {
                throw new Error('Product not found!')
            }

            if (productDeleted.image.public_id) {
                await removeFile(productDeleted.image.public_id)   
            }

            return res.status(200).json({ message: 'Product deleted!', success: true })
        } catch (error) {
            return res.status(400).json({ message: error.message, success: false })
        }
    }

    async countProducts(req, res) {
        try {
            const productCount = await Product.countDocuments()

            if (!productCount) {
                throw new Error('Empty collection!')
            }
            return res.status(200).json({ productCount, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async readFeatured(req, res) {
        try {
            const productsFeatured = await Product.find({isFeatured: true}).select('name isFeatured')
            const countFeatured = await Product.find({isFeatured: true}).countDocuments()
            if (!productsFeatured) {
                throw new Error('Empty featured list!')
            }
            return res.status(200).json({ productsFeatured, countFeatured })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }
}

module.exports = ProductController