import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name "]
    },
    description:{
        type:String,
        required:[true,"Please Enter the Product Description "],
    },
    price:{
        type:Number,
        required:[true,"Please Enter the Product Price "],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url_id:{
                type:String,
                required:true
            },
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"],
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter the Product Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1,
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export default productSchema;