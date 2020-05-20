const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const URL = require('./keys').MONGOURI;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const  http = require('http');
var server = http.createServer(app);

require('./Models/Restaurant')
require('./Models/User')
require('./Models/Order')
mongoose.connect(URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log('mongoose connected');
})
mongoose.connection.on('error',()=>{
    console.log('error connecting');
});
const indexRouter = require('./routes/index');
const orderrouter = require('./routes/order')
const usersRouter = require('./routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use(usersRouter);
app.use(orderrouter)
server.listen(5000);
