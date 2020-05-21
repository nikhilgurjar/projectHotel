const jwt =require('jsonwebtoken')
const {JWT_SECRET} = require('../Keys')
const mongoose = require('mongoose');
const Restaurants = mongoose.model('Restaurants');

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"you must be logged in"})   //return to avoid further execution
    }
    const token = authorization.replace('Bearer ',"")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return  res.status(401).json({err:"you must be logged in"})
        }
        const {_id} = payload
        Restaurants.findById(_id)
            .then(restdata=>{
                req.restaurant = restdata
                next()
            })

    })

}