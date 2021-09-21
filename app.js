var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var cors = require("cors");

const corsOptions = {
  origin: "https://frontend-ecommerce-app.herokuapp.com",
  method: ["GET", "POST"],
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

const oneDay = 1000 * 60 * 60 * 24;

var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var ordersRouter = require('./routes/orders');
var promoRouter = require('./routes/promo');
var productsRouter = require('./routes/products')

var app = express();

app.set('trust proxy', 1);
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84",
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  resave: false
}));

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/cart', cartRouter);
app.use('/promo', promoRouter);
app.use('/products', productsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.send(err.status || 500);
});

module.exports = app;
