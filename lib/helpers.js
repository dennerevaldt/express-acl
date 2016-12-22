'use strict';
const fs    = require('fs');
const _     = require('lodash');
const utils = require('./utils');

/**
 * getRules - description
 *
 * @param  {type} path     description
 * @param  {type} encoding description
 * @return {type}          description
 */
function getRules(path, encoding) {
  let rules, buffer;

  try {
    buffer = fs.readFileSync(path, { encoding });
    rules = JSON.parse(buffer);
  } catch (error) {
    throw Error(error);
  }

  return rules;
}


/**
 * resource - description
 *
 * @param  {type} next    description
 * @param  {type} url     description
 * @param  {type} baseUrl description
 * @return {type}         description
 */
function resource(next, url, baseUrl) {
  let base = (baseUrl) ? baseUrl.match(/([A-Z])\w+/gi) : '';
  let lengthOfTheBaseUrl = (base) ? base.length : 0;
  let arr = url.match(/([A-Z])\w+/gi);

  if (arr) {
    arr = arr.splice(lengthOfTheBaseUrl);
    return arr[0];
  }
  return next();
}


/**
 * getPolicy - description
 *
 * @param  {type} permissions description
 * @param  {type} resource    description
 * @return {type}             description
 */
function getPolicy(permissions, resource) {

  let policy = _.find(permissions, {
    resource: resource
  });

  if (policy) {
    return {
      methods: policy.methods
    };
  }
  return policy;
}


/**
 * getRole - description
 *
 * @param  {type} res     description
 * @param  {type} decoded description
 * @param  {type} session description
 * @return {type}         description
 */
function getRole(res, decoded, session) {
  /**
   * if role is attached to the session
   * Return role
   */
  if (decoded && decoded.role) {
    return decoded.role;
  }

  /**
   * if role is attached to the decoded
   * Return role
   */
  if (session && session.role) {
    return session.role;
  }

  /**
   * if role is not attached to the session or decoed object
   * Return role
   */
  return utils.deny(res, 404, 'REQUIRED: Role not found');
}

function getGroup(permissions, group) {
  let permissionsForGroup = _.find(permissions, { group: group });
  return permissionsForGroup.permissions;
}

module.exports = {
  getRules: getRules,
  resource: resource,
  getPolicy: getPolicy,
  getRole: getRole,
  getGroup: getGroup
};
