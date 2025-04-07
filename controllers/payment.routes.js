const router = require('express').Router()
const verifyToken = require("../middleware/verify-token")
const Payment = require('../models/Payment')

router.get("/", async (req, res) => {
    try {
        const getPayments = await Payment.find()
        res.status(201).json(getPayments)
    } catch (error) {
        res.status(500).json({err:error})
    }
})

router.get("/:paymentId", async (req, res) => {
    try{
        const foundPayment = await Payment.findById(req.params.paymentId)
        console.log(foundPayment)

        res.status(201).json(foundPayment)
    }  catch(err){
        res.status(500).json({err:err.message})
    }
})

router.post("/", async (req, res) => {
    try{
        const newPayment = await Payment.create(req.body)
        res.status(201).json(newPayment)

    }catch(err){
        res.status(500).json({err:err.message})
    }
})

router.put("/:paymentId", async (req, res) => {
    try{
    const updatePayment = await Payment.findByIdAndUpdate(req.params.paymentId, req.body,{new:true})
    res.status(200).json(updatePayment)
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

router.delete("/:paymentId", async (req, res) => {
    try{
        const deletePayment = await Payment.findByIdAndDelete(req.params.paymentId)
        console.log(deletePayment)
        res.status(200).json(deletePayment)
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

module.exports = router