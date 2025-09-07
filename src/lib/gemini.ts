import { GoogleGenAI } from '@google/genai';

/**
 * Gemini クライアントを作成する
 * @param apiKey - Google Cloud APIキー
 * @returns Gemini クライアントインスタンス
 * @description この関数はバッチ処理でしか使用しない想定
 * @example
 * const geminiClient = createGeminiClient({ apiKey: env.GEMINI_API_KEY })
 */
export function createGeminiClient({ apiKey }: { apiKey: string }) {
  const ai = new GoogleGenAI({
    apiKey,
  });
  return ai;
}

/**
 * Gemini APIを使用して出力結果を返却する
 * @param ai - Geminiクライアント
 * @param prompt - Geminiに送信するプロンプト
 * @returns Geminiの応答結果
 */
export async function getGeminiResponse({
  ai,
  prompt,
}: {
  ai: GoogleGenAI;
  prompt: string;
}): Promise<string> {
  const response = await ai.models.generateContent({
    // プロジェクトで固定
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });
  const text = response.text;
  if (!text) {
    throw new Error('Gemini APIからの応答が空です');
  }
  return text;
}
