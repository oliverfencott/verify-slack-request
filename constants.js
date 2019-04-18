const SLACK_REQUEST_TIMESTAMP_HEADER = 'X-Slack-Request-Timestamp';
const SLACK_REQUEST_SIGNATURE_HEADER = 'X-Slack-Signature';
const SLACK_COMMAND_API_VERSION = 'v0';

const REJECTION_ERROR_MESSAGE = 'Request does not match signing secret';
const MISSING_SLACK_SIGNING_SECRET_ERROR_MESSAGE = '"options.slackSigningSecret" must be passed to Slack request verifier.';

module.exports = {
  SLACK_REQUEST_TIMESTAMP_HEADER,
  SLACK_REQUEST_SIGNATURE_HEADER,
  SLACK_COMMAND_API_VERSION,

  REJECTION_ERROR_MESSAGE,
  MISSING_SLACK_SIGNING_SECRET_ERROR_MESSAGE
};
