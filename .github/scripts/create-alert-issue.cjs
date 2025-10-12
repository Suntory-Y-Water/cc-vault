/**
 * @typedef {import("../types/actions").ActionOptions} ActionOptions
 */

/**
 * Slackアラートメッセージからテスト用のIssueを作成する
 * @param {ActionOptions} options - GitHub Actions のコンテキストオプション
 */
module.exports = async ({ github, context, core }) => {
  try {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const slackResponse = process.env.SLACK_RESPONSE;
    const channelName = process.env.CHANNEL_NAME;

    if (!slackResponse) {
      core.setFailed('SLACK_RESPONSE environment variable is not set');
      return;
    }

    const response = JSON.parse(slackResponse);
    const messages = response.messages || [];

    const alertMessages = messages.filter((msg) => {
      const text = msg.text || '';
      return (
        text.includes('[ERROR]') ||
        text.includes('<!channel>') ||
        text.includes('[WARNING]')
      );
    });

    if (alertMessages.length === 0) {
      core.info('No alert messages found. Skipping issue creation.');
      return;
    }

    let body = `## チャンネル: ${channelName}\n\n`;
    body += `検出されたアラート数: ${alertMessages.length}\n\n`;
    body += '---\n\n';

    alertMessages.forEach((msg, index) => {
      body += `### アラート ${index + 1}\n\n`;
      body += '```\n';
      body += msg.text || '(no text)';
      body += '\n```\n\n';
    });

    const issue = await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: `テストissue ${timestamp}`,
      body: body,
      labels: ['add-known-alert'],
    });

    core.info(`Issue created: ${issue.data.html_url}`);
  } catch (error) {
    core.setFailed(`Failed to create issue: ${error.message}`);
  }
};
