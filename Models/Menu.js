const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const menu = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    byrestaurant:{
        type:ObjectId,
        ref:"Restaurants"
    }
})

mongoose.model("Menu",menu)