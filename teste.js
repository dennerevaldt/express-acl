'use strict';
const acl     = require('./lib/acl');
const express = require('express'),
      app     = express(),
      router  = express.Router();

acl.config({
  baseUrl: '/',
  filename:'acl.json',
  path:'config'
});

app.use(function(req, res, next){
  req.decoded = {role: 'user'};
  next();
});

app.use(acl.authorize);

app.get('/users', function (req, res) {
  res.json({'msg': 'Hello Users'});
});

app.get('/clients', function (req, res) {
  res.json({'msg': 'Hello Clients'});
});

app.listen(3000);
