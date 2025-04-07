const router = require('express').Router()
const verifyToken = require("../middleware/verify-token")
const Category = require('../models/Category')

router.get("/", async (req, res) => {
    try {
        const getCategories = await Category.find()
        res.status(201).json(getCategories)
    } catch (error) {
        res.status(500).json({err:error})
    }
})

router.get("/:categoryId", async (req, res) => {
    try{
        const foundCategory = await Category.findById(req.params.categoryId)
        console.log(foundCategory)

        res.status(201).json(foundCategory)
    }  catch(err){
        res.status(500).json({err:err.message})
    }
})

router.post("/", async (req, res) => {
    try{
        const newCategory = await Category.create(req.body)
        res.status(201).json(newCategory)

    }catch(err){
        res.status(500).json({err:err.message})
    }
})

router.put("/:categoryId", async (req, res) => {
    try{
    const updateCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body,{new:true})
    res.status(200).json(updateCategory)
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

router.delete("/:categoryId", async (req, res) => {
    try{
        const deleteCategory = await Category.findByIdAndDelete(req.params.categoryId)
        console.log(deleteCategory)
        res.status(200).json(deleteCategory)
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

module.exports = router