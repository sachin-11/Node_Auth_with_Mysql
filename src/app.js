var express = require('express');
 require('./../config/config');
var index = require('./../routes/index');
const formidable = require('express-formidable');
var app = express();
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(formidable());


app.use('/', index);


module.exports = app;
