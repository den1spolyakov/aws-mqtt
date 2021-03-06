'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUrl = exports.signedUrl = undefined;

var _awsSdkReactNative = require('aws-sdk/dist/aws-sdk-react-native');

var _awsSdkReactNative2 = _interopRequireDefault(_awsSdkReactNative);

var _awsSignature = require('./awsSignature');

var _awsSignature2 = _interopRequireDefault(_awsSignature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signedUrl = exports.signedUrl = function signedUrl(_ref) {
  var credentials = _ref.credentials,
      endpoint = _ref.endpoint,
      region = _ref.region,
      expires = _ref.expires;

  var payload = _awsSdkReactNative2.default.util.crypto.sha256('', 'hex');
  return _awsSignature2.default.createPresignedURL('GET', endpoint, '/mqtt', 'iotdevicegateway', payload, {
    key: credentials.accessKeyId,
    secret: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    protocol: 'wss',
    region: region,
    expires: expires
  });
};

var hasProtocol = function hasProtocol(endpoint) {
  return new RegExp("^wss?://").test(endpoint);
};

// This method is used when you don't pass in credentials
var unsignedUrl = function unsignedUrl(endpoint) {
  var url = '' + endpoint;
  return hasProtocol(url) ? url : 'wss://' + url;
};

// aws parameter has shape { credentials, endpoint, region, expires }
var signUrl = exports.signUrl = function signUrl(aws, callback) {
  // Need to refresh AWS credentials, which expire after initial creation.
  // For example CognitoIdentity credentials expire after an hour
  if (aws.credentials) {
    aws.credentials.get(function (err) {
      if (err) return callback(err);
      // console.log('Credentials', aws.credentials)
      callback(null, signedUrl(aws));
    });
  } else {
    callback(null, unsignedUrl(aws.endpoint));
  }
};