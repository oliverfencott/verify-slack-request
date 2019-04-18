const { createHmac } = require('crypto');

const SLACK_REQUEST_TIMESTAMP_HEADER = 'X-Slack-Request-Timestamp';
const SLACK_REQUEST_SIGNATURE_HEADER = 'X-Slack-Signature';
const SLACK_COMMAND_API_VERSION = 'v0';

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
    throw Error('"options.slackSigningSecret" must be passed to Slack request verifier.');
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
      .then(signature => signature === _getSignatureHeader(request.headers))
      .then(isValid => isValid ? request : Promise.reject(Error('Request does not match signing secret')))
  );
}

module.exports = Verifier;
