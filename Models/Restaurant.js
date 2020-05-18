
const mongoose = require('mongoose');

const restaurant = new mongoose.Schema({
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
        required:true
    },
    restaurantownername:{
        type:String,
        required:true
    },
    gstin:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    }

});


mongoose.model("Restaurants",restaurant);