'use strict';
const helper  = require('./helpers');
const utils   = require('./utils');
let opt       = {};

/**
 * config - description
 *
 * @param  {type} config description
 * @return {type}        description
 */
function config(config) {
  let options = config || {};
  opt.baseUrl = options.baseUrl;

  let defaultFilename = 'acl.json';
  let filename = options.filename ? options.filename : defaultFilename;
  let path = filename && options.path ? (`${options.path}/${filename}`) : filename;

  opt.rules = helper.getRules(path, options.encoding);

  return opt.rules;
}


/**
 * authorize - description
 *
 * @param  {type} req  description
 * @param  {type} res  description
 * @param  {type} next description
 * @return {type}      description
 */
function authorize(req, res, next) {
  let method = req.method;
  let resource = helper.resource(next, req.originalUrl, opt.baseUrl);

  let role = helper.getRole(res, req.decoded, req.session);
  let groupPermissions = helper.getGroup(opt.rules, role);

  /**
   * if no groupPermissions
   */
  if (!groupPermissions || groupPermissions.length === 0) {
    return utils.deny(res, 404, 'REQUIRED: Group not found');
  }

  let policy = helper.getPolicy(groupPermissions, resource);
  let methods = (policy) ? policy.methods : [];

  if (!policy) {
    return utils.deny(res, 404, 'REQUIRED: Policy not found');
  }

  return utils.checkMethodPermission(req, res, next, method, methods);
}


module.exports = {
  config: config,
  authorize: authorize
};
