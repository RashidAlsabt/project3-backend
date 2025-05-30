const router = require('express').Router()
const verifyToken = require("../middleware/verify-token")
const Transaction = require('../models/Transaction')
const jwt = require("jsonwebtoken")

router.get("/:page/:limit", async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        const page = parseInt(req.params.page) || 1
        const limit = parseInt(req.params.limit) || 10
        const skipRecords = (page - 1) * limit

        const totalRecords = await Transaction.countDocuments()

        const getTransactions = await Transaction.find()
            .populate(["category_id", "payment_id", "company_id"])
            .skip(skipRecords)
            .limit(limit)

        const totalPages = Math.ceil(totalRecords / limit)
        
        let totalSpendedAmount = 0.0
        getTransactions.forEach((value) => {
            totalSpendedAmount += parseFloat(value.amount)
        })

        const categorySpendMap = new Map()
        getTransactions.forEach(tx => {
            const category = tx.category_id?._id?.toString()
            const amount = parseFloat(tx.amount) || 0

            if (category) {
                if (categorySpendMap.has(category)) {
                    categorySpendMap.get(category).total += amount
                } else {
                    categorySpendMap.set(category, {
                        category_id: tx.category_id._id,
                        category_name: tx.category_id.name,
                        total: parseFloat(amount),
                    })
                }
            }
        })

        const paymentUsageMap = new Map()
        getTransactions.forEach(tx => {
            const payment = tx.payment_id?._id?.toString()

            if (payment) {
                if (paymentUsageMap.has(payment)) {
                    paymentUsageMap.get(payment).count += 1
                } else {
                    paymentUsageMap.set(payment, {
                        payment_id: tx.payment_id._id,
                        payment_name: tx.payment_id.name,
                        count: 1,
                    })
                }
            }
        })

        const paymentUsageArray = Array.from(paymentUsageMap.values())
        const categorySpendArray = Array.from(categorySpendMap.values())

        const finalTransList = getTransactions.filter((value) => value.company_id._id.toString() === decoded.payload._id)

        res.status(201).json({
            data: finalTransList,
            pagination: {
                page: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
                limit: limit,
            },
            chartsDetails: {
                totalSpendedAmount: totalSpendedAmount,
                categories: categorySpendArray,
                payments: paymentUsageArray,
            }
        })

    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})


router.get("/graph-details", async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        
        const totalRecords = await Transaction.countDocuments()

        const getTransactions = await Transaction.find().populate([
            "category_id",
            "payment_id",
            "company_id"
        ])

        const finalTransList = getTransactions.filter((value) => value.company_id._id.toString() === decoded.payload._id)
        
        let totalSpendedAmount = 0.0
        finalTransList.forEach((value) => {
            totalSpendedAmount += parseFloat(value.amount)
        })

        const categorySpendMap = new Map()

        finalTransList.forEach(tx => {
            const category = tx.category_id?._id?.toString()
            const amount = parseFloat(tx.amount) || 0

            if (category) {
                if (categorySpendMap.has(category)) {
                    categorySpendMap.get(category).total += amount
                } else {
                    categorySpendMap.set(category, {
                        category_id: tx.category_id._id,
                        category_name: tx.category_id.name,
                        total: parseFloat(amount)
                    })
                }
            }
        })

        const paymentUsageMap = new Map()

        finalTransList.forEach(tx => {
            const payment = tx.payment_id?._id?.toString()

            if (payment) {
                if (paymentUsageMap.has(payment)) {
                    paymentUsageMap.get(payment).count += 1
                } else {
                    paymentUsageMap.set(payment, {
                        payment_id: tx.payment_id._id,
                        payment_name: tx.payment_id.name,
                        count: 1
                    })
                }
            }
        })

        const paymentUsageArray = Array.from(paymentUsageMap.values())
        const categorySpendArray = Array.from(categorySpendMap.values())
        

        res.status(201).json({
            chartsDetails: {
                totalSpendedAmount: totalSpendedAmount,
                categories: categorySpendArray,
                payments: paymentUsageArray
            }
        })

    } catch (error) {
        res.status(500).json({err:error})
    }
})

router.get("/:transactionId", async (req, res) => {
    try{
        const foundTransaction = await Transaction.findById(req.params.transactionId).populate([
            "category_id",
            "payment_id",
            "company_id"
        ])
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