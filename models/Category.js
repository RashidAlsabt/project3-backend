const {Schema, model} = require("mongoose")

const categorySchema = new Schema({
    name: {
        type: String,
        required:[ true, "Category name is requried" ],
        trim:true
    },
    image_url:{
        type:String,
    },
}, {
    timestamps: true
})

const Category = model("Category", categorySchema)

module.exports = Category