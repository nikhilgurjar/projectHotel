const express =  require('express');
const mongoose = require("mongoose")
const Logincheck = require("../Middleware/Loginchecck")
const Restaurants = mongoose.model("Restaurants");
const router = express.Router();
const Restaurant = mongoose.model('Restaurants');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../Keys')
const Menu = mongoose.model("Menu")
router.post('/usersignup',(req,res)=>{
  const {name,email,phone,restaurantname,table}=req.body
  console.log(req.body)
  if(!email || !restaurantname || !name || !table || !phone){
    return res.status(422).json({error:"please fill all the fields"})
  }
  Restaurant.findOne({restaurantname:restaurantname}).then((restaurant)=>{
      if(!restaurant){
          return res.json({error: "restaurant not found"})
      }
      User.findOne({email:email})
          .then(saveduser=>{
              if(!saveduser){
                  const user = new User({
                      name,
                      email,
                      phone
                  })
                  user.save()
                      .then(user=>{
                          console.log(user)
                          return res.status(200).json({restaurantid:restaurant._id,user})
                      })
              }
              const {name,phone,restaurantname,table} = req.body;
              res.json({message:"succesfully registered",user:{name,phone,restaurantname,table}});
          })
      }

  )

});
router.post('/restaurantsignup',(req,res)=>{
    const {name,email,password,gstin,restaurantownername}=req.body
    console.log(req.body)
    if(!email || !password || !name ||!gstin || !restaurantownername){
        return res.status(422).json({error:"please fill all the fields"})
    }
    User.find({},{email:email,name:name,gstin:gstin})
        .then((saveduser)=>
        {
            if(saveduser){
                return  res.status(422).json({error:"Restaurant already Exists  with some important information"})
            }
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {

                    const restaurant = new Restaurant({
                        email,
                        password:hash,
                        name,
                        gstin,
                        restaurantownername
                    })
                    restaurant
                        .save()
                        .then(restaurant => {
                            res.json({message:"succesfully registered"})
                            // res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                });
            });


        })
        .catch(err=>{
            console.log(err)
        })
});
router.post('/signin',(req,res)=>{
    console.log(req.body)
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error:"please fill all details"})
    }
    User.findOne({email:email})
        .then(saveduser=>{
            if(!saveduser) {
                return res.status(422).json({error: "invalid email or password"})
            }
            bcrypt.compare(password,saveduser.password)
                .then(domatch=>{
                    if(domatch){
                        //res.json({message: "succefully signin"})
                        const token = jwt.sign({_id:saveduser._id},JWT_SECRET)
                        const {_id,name,email,restaurantownername,gstin} = saveduser;
                        res.json({token,restaurant:{_id,name,email,restaurantownername,gstin}});
                    }
                    else{
                        return res.json({err:"invalid email or adress"});
                    }
                })
                .catch(err=>{
                    console.log(err)
                })


        })
})
router.post('/addmenu',Logincheck,(req,res)=>{
    const {menu} = req.body;
    Menu.find({
        $and:[
            {byrestaurant:req.restaurant._id},
            {name:menu.name}
        ]
    })
        .then((restmenu)=>{
          if(!restmenu){
              const newmenu = new Menu({
                  name:menu.name,
                  price:menu.price,
                  byrestaurant:req.restaurant._id
              })
              newmenu.save()
                  .then((result)=>{
                      res.status(200).json({message:"succesfully added menu"})
                  })
                  .catch((err)=>{
                      console.log(err)
                      return res.status(422).json({err:err})
                  })
          }
            restmenu.update(
                { name:menu.name },
                { $set:
                        {
                            name:menu.name,
                            price: menu.price ,
                        }
                }
            )
             })




})
router.put('/deletemenu',Logincheck,(req,res)=>{
   Restaurant.findByIdAndUpdate(req.restaurant._id,{
       $pull:{menu:req.body.menuid}
   })
       .then((result)=>{
           console.log(result)
           return res.status(200).json({message:"deleted succesfully"})
       })
       .catch((err)=>{
           console.log(err)
           return res.status(422).json({err:err})
       })
})
router.get('/allmenu',(req,res)=>{
    Menu.find({byrestaurant:req.body.restaurantid})
        .then(result=>{
            if(!result){
                return res.status(422).json({message:"no menu found with this restaurant"})
            }
            console.log(result)
            return res.status(200).json({menu:result})
        })
})
module.exports = router;



