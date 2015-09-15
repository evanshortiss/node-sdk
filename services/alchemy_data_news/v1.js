/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var extend         = require('extend');
var requestFactory = require('../../lib/requestwrapper');
var endpoints      = require('../../lib/alchemy_endpoints.json');
var helper         = require('../../lib/helper');

function errorFormatter(cb) {
  return function(err, result, response) {
    if (err) {
      cb(err, result);
    }
    else {
      if (result.status === 'OK')
        cb(err,result);
      else
        cb({
          error: result.statusInfo || response['headers']['x-alchemyapi-error-msg'],
          code: 400
        }, null);
    }
  };
}

function createRequest(method) {
  return function(_params, callback ) {
    var params = _params || {};
    var accepted_formats = Object.keys(endpoints[method]);
    var format = helper.getFormat(params, accepted_formats);

    if (format === null) {
      callback(new Error('Missing required parameters: ' +
        accepted_formats.join(', ') +
        ' needs to be specified'));
      return;
    }

    var parameters = {
      options: {
        url: endpoints[method][format],
        method: 'POST',
        json: true,
        form: extend({outputMode: 'json'}, params) // change default output to json
      },
      defaultOptions: this._options
    };
    return requestFactory(parameters, errorFormatter(callback));
  };
}

function AlchemyDataNews(options) {
  // Default URL
  var serviceDefaults = {
    url: 'https://access.alchemyapi.com/calls'
  };
  // Replace default options with user provided
  this._options = extend(serviceDefaults, options);
}

/**
 * Extracts a grouped, ranked list of named entities (people, companies,
 * organizations, etc.) from text, a URL or HTML.
 */
AlchemyDataNews.prototype.getNews = function(params, callback ) {
    params = params || {};

    var parameters = {
      options: {
        url: '/data/GetNews',
        method: 'GET',
        json: true,
        qs: extend({}, params, {outputMode: 'json'}) // change default output to json
      },
      requiredParams: ['end','start'],
      defaultOptions: this._options
    };
    return requestFactory(parameters, errorFormatter(callback));
  };

module.exports = AlchemyDataNews;