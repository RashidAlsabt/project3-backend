const router = require('express').Router()
const verifyToken = require("../middleware/verify-token")
const Transaction = require('../models/transaction')

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1
        const limit = parseInt(req.body.limit) || 10
        const skipRecords = (page - 1) * limit

        const totalRecords = await Transaction.countDocuments()

        const getTransactions = await Transaction.find().populate([
            "category_id",
            "payment_id"
        ]).skip(skipRecords).limit(limit)

        const totalPages = Math.ceil(totalRecords / limit)

        res.status(201).json({
            data: getTransactions,
            pagination: {
                page: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: limit,
            }
        })
    } catch (error) {
        res.status(500).json({err:error})
    }
})

router.get("/:transactionId", async (req, res) => {
    try{
        const foundTransaction = await Transaction.findById(req.params.transactionId)
        console.log(foundTransaction)

        res.status(201).json(foundTransaction)
    }  catch(err){
        res.status(500).json({err:err.message})
    }
})

router.post("/", async (req, res) => {
    try{
        const newTransaction = await Transaction.create(req.body)
        res.status(201).json(newTransaction)

    }catch(err){
        res.status(500).json({err:err.message})
    }
})

router.put("/:transactionId", async (req, res) => {
    try{
    const updateTransaction = await Transaction.findByIdAndUpdate(req.params.transactionId, req.body,{new:true})
    res.status(200).json(updateTransaction)
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

router.delete("/:transactionId", async (req, res) => {
    try{
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.transactionId)
        console.log(deletedTransaction)
        res.status(200).json(deletedTransaction)
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

module.exports = router