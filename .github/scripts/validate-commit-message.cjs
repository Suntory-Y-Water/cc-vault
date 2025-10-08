/**
 * @typedef {import("../types/actions").ActionOptions} ActionOptions
 */

/**
 * Conventional Commitsの形式でコミットメッセージを検証し、PR にコメントする
 * @param {ActionOptions} options
 */
module.exports = async ({ github, context, core }) => {
  const commits = context.payload.commits || [];
  const conventionalCommitPattern =
    /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+/;

  const invalidCommits = commits.filter((commit) => {
    return !conventionalCommitPattern.test(commit.message);
  });

  const prNumber = context.payload.pull_request?.number;

  // 不正なコミットメッセージが存在する場合はエラーメッセージがあることを通知
  if (invalidCommits.length > 0) {
    const messages = invalidCommits.map((c) => `- \`${c.message}\``).join('\n');
    const errorMessage = `❌ 不正なコミットメッセージが見つかりました\n\n${messages}\n\n**期待される形式:** \`type(scope?): subject\`\n\n**使用可能なtype:** feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert`;

    core.setFailed(errorMessage);

    if (prNumber) {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: errorMessage,
      });
    }
    return;
  }

  // すべてのコミットメッセージが正常な場合
  const successMessage = '✅ すべてのコミットメッセージが正常です！';
  core.info(successMessage);
  return;
};
