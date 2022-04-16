const express = require('express')
const { prefix } = require('../config')
const Category = require('../models/category')
const Product = require('../models/product')
const router = express.Router()
const mongoose = require('mongoose')

router.get(`${prefix}/products`, async (req, res) => {

    let filter = {}

    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter)

    const countList = await Product.find(filter).countDocuments()

    if (!productList) {
        return res.status(500).json({success: false})
    }

    return res.status(200).json({productList,countList})
})

router.get(`${prefix}/products/:id`, async(req, res) => {
    const idProduct = req.params.id
    const product = await Product.findById(idProduct).populate('category')
    if (!product) {
        return res.status(500).json({message: 'The product not found!', success: false})
    }
        
    return res.status(200).send(product)
})

router.post(`${prefix}/products`, async (req, res) => {
    const category = await Category.findById(req.body.category)
    if (!category)
        return res.status(400).json({message: 'The category not exists!'})

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,        
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    try {
        product = await product.save()
        if (!product)
            return res.status(500).json({message: 'The product cannot be created!'})
        return res.status(200).send(product)
    } catch (error) {
        // return res.status(400).json(error)
        console.log(error)
    }

    // product.save().then(createdProduct => {
    //     res.status(201).json(createdProduct)
    // }).catch(err => {
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })
})

router.put(`${prefix}/products/:id`, async (req, res) => {
    const idProduct = req.params.id
    if (!mongoose.isValidObjectId(idProduct))
        return res.status(200).json({message: 'Invalid Product Id'})

    const category = await Category.findById(req.body.category)
    if (!category)
        return res.status(400).json({message: 'The category not exists!'})

    try {
        let product = await Product.findByIdAndUpdate(idProduct,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
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

        if (!product)
            return res.status(400).json({message: 'Failed top update!'})
        return res.status(201).send({product, success: true})
    } catch (error) {
        console.log(error)
    }
})

router.delete(`${prefix}/products/:id`, async (req, res) => {
    let id = req.params.id
    try {
        let productDeleted = await Product.findByIdAndDelete(id)

        if (!productDeleted) {
            return res.status(400).json({
                success: false,
                message: 'Product not found!'
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: 'Product deleted!'
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get(`${prefix}/count`, async (req, res) => {
    const productCount = await Product.countDocuments()

    if (!productCount)
        return res.status(500).json({message: 'Empty collection!'})
    
    return res.status(200).json({productCount: productCount})
})

router.get(`${prefix}/featured`, async (req, res) => {
    const productsFeatured = await Product.find({isFeatured: true}).select('name isFeatured')

    const countFeatured = await Product.find({isFeatured: true}).countDocuments()

    if (!productsFeatured)
        return res.status(500).json({success: false})

    return res.status(200).json({productsFeatured, countFeatured})
})

module.exports = router