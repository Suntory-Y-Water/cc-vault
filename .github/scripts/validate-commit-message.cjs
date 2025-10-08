/**
 * @typedef {import("../types/actions").ActionOptions} ActionOptions
 */

/**
 * Conventional Commitsの形式でコミットメッセージを検証する
 * @param {ActionOptions} options
 */
module.exports = async ({ context, core }) => {
  // こいつany型なんだよなぁ
  const commits = context.payload.commits || [];
  const conventionalCommitPattern =
    /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+/;

  const invalidCommits = commits.filter((commit) => {
    return !conventionalCommitPattern.test(commit.message);
  });

  if (invalidCommits.length > 0) {
    const messages = invalidCommits.map((c) => `- ${c.message}`).join('\n');
    core.setFailed(
      `❌ Invalid commit messages found:\n\n${messages}\n\nExpected format: type(scope?): subject`,
    );
  } else {
    core.info('✅ All commit messages are valid!');
  }
};
