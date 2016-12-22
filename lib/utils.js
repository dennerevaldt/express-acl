'use strict';
const _  = require('lodash');

/**
 * checkMethodPermission - description
 *
 * @param  {type} method      description
 * @param  {type} methods     description
 * @param  {type} queryString description
 * @return {type}             description
 */
function checkMethodPermission(method, methods, queryString) {
  let methodSelected = _.find(methods, { 'http': method });
  if (methodSelected) {
    if (methodSelected.http === 'GET' && queryString !== {}) {
      var cont = 0;
      Object.keys(queryString).forEach(function (key) {
         var boolean = _.includes(methodSelected.qs, key);
         if (!boolean) { cont++; };
      });
    }
    if(cont > 0) return false;
    return true;
  }
  return false;
}

module.exports = {
  checkMethodPermission: checkMethodPermission
};
