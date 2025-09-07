## 型安全、どうやって保証してる？

みなさんは普段どのように型の安全性を保証していますか？  
TypeScriptを使っている方なら、型定義や型注釈、型推論で「型安全」を意識しているはずです。  
しかし、実際のアプリケーション開発では「本当に型安全か？」と問われると、少し不安になることも多いのではないでしょうか。

## Zodのスキーマ定義・型生成・データ検証

TypeScript界隈で人気の型安全ライブラリ「Zod」。  
Zodを使えば、スキーマ定義・型生成・データ検証が一気通貫で行えます。

例えば「idは5桁かつ英数字のみ、nameは3文字以上15文字以下の文字列」としてUserSchemaを定義するとき、以下のようにスキーマ定義・型生成・データ検証ができます。

```ts
import { z } from "zod";

// スキーマ定義
const UserSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9]{5}$/), // 5桁の英数字のみ
  name: z.string().min(3).max(15), // 3文字以上15文字以下の文字列
});

// スキーマ定義から型生成
type User = z.infer<typeof UserSchema>;

// parseメソッドで検証
const userNG: User = UserSchema.parse({ id: "hoge!@#", name: "yu" }); // => 形式違いでエラー
const userOK: User = UserSchema.parse({ id: "abc45", name: "Taro" }); // => OK
```

## Zodだけでは型安全は不十分

Zodは強力ですが、実は「 **Zodだけ** 」では型安全が不十分なケースがあります。

たとえば、 `id: z.string()` や `id: z.string().regex(/^[a-zA-Z0-9]{5}$/)` でスキーマを定義しても、型レベルではどちらも **任意のstring** として解釈されてしまいます。

```ts
import { z } from "zod";

// スキーマ定義
const UserSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9]{5}$/), // 5桁の英数字のみ
  name: z.string().min(3).max(15), // 3文字以上15文字以下の文字列
});

// スキーマ定義から型生成
type User = z.infer<typeof UserSchema>;

// 直接代入
// 形式が違うのにエラーにならない！
const user: User = { id: "!abcde12345", name: "a" }
```

`id` も `name` もスキーマ定義に反した値ですが、型レベルで見るとどちらも `string` なので、直接代入すると間違った値でも代入できてしまいます。

`z.infer<typeof UserSchema>` で生成した `User型` は以下のようになります。

```ts
type User = {
  id: string;
  name: string;
}
```

## Branded Typeとは

この問題を解決するのが「 **Branded Type（以下、ブランド型）** 」です。  
ブランド型は、同じ構造のデータを **プロパティ** や **シンボル** を使って「 **意味の違い** 」を型レベルで区別するための型または手法のことです。

## Branded Typeの使い方

ブランド型の基本形は次の通りです。

```ts
type UserId = string & { readonly _brand: "user_id" };
type OrderId = string & { readonly _brand: "order_id" };

function createUserId(): UserId {
  // ここでID生成処理
  return id as UserId;
}

function createOrderId(): OrderId {
  // ここでID生成処理
  return id as OrderId;
}

const userId: UserId = createUserId(); // OK
const orderId: OrderId = createOrderId(); // OK

// ブランド型のおかげで型レベルで区別できる
const invalid: UserId = orderId; // 型エラー
```

このように、 `UserId` 型と `OrderId` 型はどちらも `string` ですが、ブランド型を付与することで型レベルで区別でき、意図しない値の混入を防げます。

Zodではv3.18.0以降で `brand` メソッドを使ってスキーマにブランド型を付与できます。

```ts
import { z } from "zod";

// スキーマ定義
const UserSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9]{5}$/), // 5桁の英数字のみ
    name: z.string().min(3).max(15), // 3文字以上15文字以下の文字列
  })
  .brand<"User">(); // brand<任意の文字列>()
```

## Zod + Branded Typeで真の型安全へ

Zodのスキーマ定義・型生成・parseメソッドにブランド型を組み合わせることで、真の型安全を実現できます。

```ts
import { z } from "zod";

// スキーマ定義
const UserSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9]{5}$/), // 5桁の英数字のみ
    name: z.string().min(3).max(15), // 3桁以上15桁以下の文字列
  })
  .brand<"User">(); // brand<任意の文字列>()

// スキーマ定義から型生成
type User = z.infer<typeof UserSchema>;

// parseメソッドで検証
const userNG: User = UserSchema.parse({ id: "hoge!@#", name: "yu" }); // => 形式違いでエラー
const userOK: User = UserSchema.parse({ id: "abc45", name: "Taro" }); // => OK

// 直接代入
const user: User = { id: "abc45", name: "Taro" } // 形式は合っているがブランド型が無いためエラー
```

parseメソッドを使うことで、パース後の値には自動的に `[BRAND]` というシンボルが付与されるようになります。  
直接代入した場合、 `[BRAND]` が存在しないためエラーとなります。

このようにZodの `brand` を使うことで、 **parseメソッドを通過したデータだけが型チェックをクリア** し、型安全をさらに強化できます。

## 実際のユースケース

より実践的な例を見てみましょう。

APIレスポンス処理での活用例

api-response-example.ts

```ts
import { z } from "zod";

// APIレスポンス用のスキーマ
const ApiUserSchema = z
  .object({
    id: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(["admin", "user", "guest"]),
  })
  .brand<"ApiUser">();

type ApiUser = z.infer<typeof ApiUserSchema>;

// API呼び出し関数
async function fetchUser(id: string): Promise<ApiUser> {
  const response = await fetch(\`/api/users/${id}\`);
  const data = await response.json();
  
  // 実行時検証 + ブランド型付与
  return ApiUserSchema.parse(data);
}

// 使用例
async function handleUser() {
  try {
    const user = await fetchUser("123");
    // userは検証済み & ブランド型付きのデータ
    console.log(user.name); // 安全にアクセス可能
  } catch (error) {
    console.error("Invalid user data:", error);
  }
}
```

フォームバリデーションでの活用例

form-validation-example.ts

```ts
import { z } from "zod";

// フォームデータ用のスキーマ
const ContactFormSchema = z
  .object({
    name: z.string().min(1, "名前は必須です").max(50, "名前は50文字以内で入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    message: z.string().min(10, "メッセージは10文字以上で入力してください"),
  })
  .brand<"ContactForm">();

type ContactForm = z.infer<typeof ContactFormSchema>;

// フォーム送信処理
function submitContactForm(formData: unknown): ContactForm {
  // フォームデータを検証してブランド型を付与
  return ContactFormSchema.parse(formData);
}

// 使用例
function handleFormSubmit(rawData: unknown) {
  try {
    const validatedData = submitContactForm(rawData);
    // validatedDataは検証済み & ブランド型付きのデータ
    sendEmail(validatedData);
  } catch (error) {
    // バリデーションエラーの処理
    console.error("Form validation failed:", error);
  }
}
```

## メリット

Zod + Branded Typeの組み合わせによる主なメリット：

- **コンパイル時と実行時の両方で型安全性を保証**
- **意図しないデータの混入を防止**
- **APIレスポンスやフォームデータの検証が確実**
- **リファクタリング時の安全性向上**
- **チーム開発での品質向上**

## まとめ

Zodは型安全の第一歩ですが、ブランド型を組み合わせることで「 **意味まで含めた真の型安全** 」を実現できます。  
型安全にこだわるなら、ぜひZod + Branded Typeの組み合わせを試してみてください！