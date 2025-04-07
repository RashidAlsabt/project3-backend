const {Schema, model} = require("mongoose")

const paymentSchema = new Schema({
    name: {
        type: String,
        required:[ true, "Payment name is requried" ],
        trim:true
    },
    image_url:{
        type:String,
    },
}, {
    timestamps: true
})

const Payment = model("Payment", paymentSchema)

module.exports = Payment