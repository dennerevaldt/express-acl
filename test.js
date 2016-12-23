'use strict';
const acl     = require('./lib/acl');
const express = require('express'),
      app     = express(),
      router  = express.Router();

// middleware config acl
acl.config({
  baseUrl: '/',
  filename:'acl.json',
  path:'config'
});

// simulate token
app.use(function(req, res, next){
  req.decoded = {role: 'user'};
  next();
});

// authorize acl
app.use(acl.authorize);

// routes simulate
app.get('/users', function (req, res) {
  var params = req.query;
  var msg = 'Hello get users';
  res.json({'msg': msg, params: params});
});

app.post('/users', function (req, res) {
  res.json({'msg': 'Hello post users'});
});

app.put('/users', function (req, res) {
  res.json({'msg': 'Hello put users'});
});

app.get('/clients', function (req, res) {
  var params = req.query;
  var msg = 'Hello get clients';
  res.json({'msg': msg, params: params});
});

// error handling
app.use(function(request, response, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, request, response, next) {
	response.status(err.status || 500).json({ error: err.errors || err.message });
});

app.listen(3000);
