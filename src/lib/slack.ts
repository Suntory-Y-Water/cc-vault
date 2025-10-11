import { WebClient, ChatPostMessageResponse } from '@slack/web-api';

/**
 * メッセージレベル定義
 */
type MessageLevel = 'INFO' | 'ERROR';

/**
 * Slackメッセージパラメータ
 */
type SlackMessageParams = {
  /** 送信先チャンネルID(例: C0123456789) */
  channelId: string;
  /** メッセージレベル */
  level: MessageLevel;
  /** メッセージ本文 */
  message: string;
  /** @channel メンションするかのフラグ */
  channelMention?: boolean;
};

/**
 * Slackメッセージ送信クライアント
 */
export class SlackClient {
  private client: WebClient;

  /**
   * @param token Slack Bot Token (xoxb-...)
   */
  constructor(token: string) {
    if (!token) throw new Error('SLACK_BOT_TOKEN is missing');
    this.client = new WebClient(token);
  }

  /**
   * Slackへメッセージを送信する
   * @param {SlackMessageParams} params - 投稿パラメータ
   * @returns {Promise<string>} SlackのメッセージTS(投稿識別子)
   */
  async postMessage(params: SlackMessageParams): Promise<string> {
    const { channelId, level, message, channelMention = false } = params;

    if (!channelId) throw new Error('channelId is required');
    if (!message) throw new Error('message is required');

    const formattedMessage = this.formatMessage(level, message, channelMention);

    const response: ChatPostMessageResponse =
      await this.client.chat.postMessage({
        channel: channelId,
        text: formattedMessage,
      });

    if (!response.ok || !response.ts) {
      throw new Error(`Slack API error: ${JSON.stringify(response)}`);
    }

    return response.ts;
  }

  /**
   * メッセージをフォーマットする
   */
  private formatMessage(
    level: MessageLevel,
    message: string,
    channelMention: boolean,
  ): string {
    const mention = channelMention ? '<!channel>\n' : '';
    return `${mention}[${level}] ${message}`;
  }
}
