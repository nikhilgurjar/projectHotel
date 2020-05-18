const express =  require('express');
const mongoose = require("mongoose")
const Restaurant = mongoose.model('Restaurants');

const router = express.Router();
const Logincheck = require("../Middleware/Loginchecck")
// var http = require('http').Server;
// var io = require('socket.io')(http);

//export const signingup = ({restaurantname})=>{
  //  const nsp = io.of(restaurantname);

    // nsp.on('connection', function(socket){
    //     console.log('someone connected');
    // });
//}

//nsp.emit('hi', 'everyone!');
router.post('/order',(req,res)=>{
    const {items,user} = req.body
    if(!items){
        return res.json({error:"you have no items picked"});
    }
    if(!user) {
        return res.json({error: "you must signup first"});
    }
    Restaurant.findOne({name:user.restaurantname})
        .then(restaurant=>{
            if(!restaurant){
                return res.status(422).json({err:"no restaurant found with this name"});
            }


        })


});

module.exports = router;
