import { WebClient, ChatPostMessageResponse } from '@slack/web-api';

export type PostMessageParams = {
  /** 送信先チャンネルID（例: C0123456789） */
  channelId: string;
  /** 投稿テキスト */
  text: string;
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
   * Slackへプレーンテキストメッセージを送信する
   * @param {PostMessageParams} params - 投稿パラメータ
   * @returns {Promise<string>} SlackのメッセージTS（投稿識別子）
   */
  async postMessage(params: PostMessageParams): Promise<string> {
    const { channelId, text } = params;

    if (!channelId) throw new Error('channelId is required');
    if (!text) throw new Error('text is required');

    const response: ChatPostMessageResponse =
      await this.client.chat.postMessage({
        channel: channelId,
        text,
      });

    if (!response.ok || !response.ts) {
      throw new Error(`Slack API error: ${JSON.stringify(response)}`);
    }

    return response.ts;
  }
}
