const { createHmac } = require('crypto');
const timingSafeCompare = require('tsscmp');

const {
  SLACK_REQUEST_TIMESTAMP_HEADER,
  SLACK_REQUEST_SIGNATURE_HEADER,
  SLACK_COMMAND_API_VERSION,

  MISSING_SLACK_SIGNING_SECRET_ERROR_MESSAGE,
  REJECTION_ERROR_MESSAGE
} = require('./constants');

const _getHeader = header => headers => headers[header] || headers[header.toLowerCase()];
const _getTimestampHeader = _getHeader(SLACK_REQUEST_TIMESTAMP_HEADER);
const _getSignatureHeader = _getHeader(SLACK_REQUEST_SIGNATURE_HEADER);

const Verifier = (...args) => {
  const [
    {
      slackSigningSecret,
      slackAPIVersion = SLACK_COMMAND_API_VERSION
    } = {},
    request
  ] = args;

  if (!slackSigningSecret) {
    throw Error(MISSING_SLACK_SIGNING_SECRET_ERROR_MESSAGE);
  }

  if (args.length === 1 || !request) {
    return actualRequest => Verifier({ slackSigningSecret, slackAPIVersion }, actualRequest);
  }

  return (
    Promise
      .resolve(request.body)
      .then(rawBody => ([
        slackAPIVersion,
        _getTimestampHeader(request.headers),
        rawBody
      ].join(':')))
      .then(signatureBase => (
        createHmac('sha256', slackSigningSecret)
          .update(signatureBase)
          .digest('hex')
      ))
      .then(digest => [ slackAPIVersion, digest ].join('='))
      .then(signature => timingSafeCompare(signature, _getSignatureHeader(request.headers)))
      .then(isValid => isValid ? request : Promise.reject(Error(REJECTION_ERROR_MESSAGE)))
  );
}

module.exports = Verifier;
