const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,

    },
    restaurantname:{
        type:String,
        required:true
    },
    table:{
        type:Number,
        require:true
    }
})

mongoose.model("User",User);