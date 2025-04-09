const {Schema, model} = require("mongoose")

const transactionSchema = new Schema({
    company_id: {
        type: Schema.Types.ObjectId,
        required:[true,"Company is required"],
        ref:"Company"
    },
    category_id:{
        type: Schema.Types.ObjectId,
        required:[true,"Category is required"],
        ref:"Category"
    },
    payment_id:{
        type: Schema.Types.ObjectId,
        required:[true,"Payment is required"],
        ref:"Payment"
    },
    description:{
        type:String,
    },
    amount:{
        type:String,
        required:[true,"Amount is required"]
    }
}, {
    timestamps: true
})

const Transaction = model("Transaction", transactionSchema)

module.exports = Transaction