import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import v4 from './awsSignature';

export const signedUrl = ({ credentials, endpoint, region, expires }) => {
  const payload = AWS.util.crypto.sha256('', 'hex');
  return v4.createPresignedURL('GET', endpoint, '/mqtt', 'iotdevicegateway', payload, {
    key: credentials.accessKeyId,
    secret: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    protocol: 'wss',
    region: region,
    expires: expires,
  })
}

const hasProtocol = (endpoint) =>
  new RegExp("^wss?://").test(endpoint)

// This method is used when you don't pass in credentials
const unsignedUrl = (endpoint) => {
  const url = `${endpoint}`
  return hasProtocol(url)
    ? url
    : `wss://${url}`
}

// aws parameter has shape { credentials, endpoint, region, expires }
export const signUrl = (aws, callback) => {
  // Need to refresh AWS credentials, which expire after initial creation.
  // For example CognitoIdentity credentials expire after an hour
  if (aws.credentials) {
    aws.credentials.get((err) => {
      if (err) return callback(err)
      // console.log('Credentials', aws.credentials)
      callback(null, signedUrl(aws))
    })
  } else {
      callback(null, unsignedUrl(aws.endpoint))
  }
}
