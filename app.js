const express = require('express');
const path = require('path');
const app = express();

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const  http = require('http');
var server = http.createServer(app);

const indexRouter = require('./routes/index');
const orderrouter = require('./routes/order')
const usersRouter = require('./routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(usersRouter);
app.use(orderrouter)
server.listen(3000);
