'use strict';

/**
 * checkMethodPermission - description
 *
 * @param  {type} method      description
 * @param  {type} methods     description
 * @param  {type} queryString description
 * @return {type}             description
 */
function checkMethodPermission(method, methods, queryString) {
  let methodSelected = methods.find(item => item.http === method);
  if (methodSelected) {
    if (methodSelected.http === 'GET' && queryString !== {}) {
      var cont = 0;
      var arr = methodSelected.qs;
      Object.keys(queryString).forEach(function (key) {
        var boolean = arr ? arr.includes(key) : false;
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
