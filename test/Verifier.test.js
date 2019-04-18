const Verifier = require('../Verifier');
const {
  REJECTION_ERROR_MESSAGE,
  MISSING_SLACK_SIGNING_SECRET_ERROR_MESSAGE
} = require('../constants');

const {
  MOCK_CORRECT_SLACK_SIGNING_SECRET,
  MOCK_ERRONEOUS_SLACK_SIGNING_SECRET,
  MOCK_SUCCESSFUL_REQUEST_OPTIONS
} = require('./helpers');

describe('Slack request verifier', () => {
  it('throws when not passed a slackSigningSecret', () => {
    expect(Verifier).toThrow(Error(MISSING_SLACK_SIGNING_SECRET_ERROR_MESSAGE));
  });

  it('returns a function if invoked with one argument', () => {
    expect(
      Verifier({ slackSigningSecret: MOCK_CORRECT_SLACK_SIGNING_SECRET })
    ).toBeInstanceOf(Function);
  });

  it('returns a promise when called correctly', () => {
    expect(
      Verifier({ slackSigningSecret: MOCK_CORRECT_SLACK_SIGNING_SECRET },
      MOCK_SUCCESSFUL_REQUEST_OPTIONS
    )).toBeInstanceOf(Promise);

    expect(
      Verifier({ slackSigningSecret: MOCK_CORRECT_SLACK_SIGNING_SECRET })(
      MOCK_SUCCESSFUL_REQUEST_OPTIONS
    )).toBeInstanceOf(Promise);
  });

  test('returns original options object when called correctly', () => (
    expect(
      Verifier({ slackSigningSecret: MOCK_CORRECT_SLACK_SIGNING_SECRET },
      MOCK_SUCCESSFUL_REQUEST_OPTIONS
    )).resolves.toBe(MOCK_SUCCESSFUL_REQUEST_OPTIONS))
  );

  test('rejects with an error when called incorrectly', () => (
    expect(
      Verifier({ slackSigningSecret: MOCK_ERRONEOUS_SLACK_SIGNING_SECRET },
      MOCK_SUCCESSFUL_REQUEST_OPTIONS
    )).rejects.toThrow(Error(REJECTION_ERROR_MESSAGE)))
  );
})
