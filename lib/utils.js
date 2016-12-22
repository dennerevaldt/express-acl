'use strict';
const _  = require('lodash');

function deny(res, status, customMessage) {
  let message = customMessage ? customMessage : 'Unauthorized access';

  return res.status(status)
    .send({
      status: 'Access denied',
      success: false,
      message: message
    });
}

function checkMethodPermission(req, res, next, method, methods) {

  let methodSelected = _.find(methods, { 'http': method });

  if (methodSelected) {
    let queryString = req.query;

    if (methodSelected.http === 'GET' && queryString !== {}) {

      Object.keys(queryString).forEach(function (key) {
         var boolean = _.includes(methodSelected.qs, key);

         if (!boolean) {
           return deny(res, 403, 'UNAUTHORIZED: Query string');
         };
      });

    }
    return next();
  }

  return deny(res, 403, null);
}

module.exports = {
  deny: deny,
  checkMethodPermission: checkMethodPermission
};
