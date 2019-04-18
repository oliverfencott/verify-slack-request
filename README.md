# verify-slack-request
Verify incoming HTTP requests from Slack

#### Usage

```js
const SlackRequestVerifier = require('@vidglo/verify-slack-request');

const verifyIncomingRequest = SlackRequestVerifier({ slackSigningSecret: MY_SLACK_SIGNING_SECRET });

// Inside your route/lambda function
(req, res) => {
  const options = {
    // Expects body to be application/x-www-form-urlencoded
    body: req.body,
    // Expects headers to include 'X-Slack-Request-Timestamp' and 'X-Slack-Signature'
    headers: req.headers,
  }
  // Returns a promise
  verifyIncomingRequest(options)
    .then(arg => arg === options /* success! continue */)
    .catch(error => error.toString() === 'Error: Request does not match signing secret')
};
```
