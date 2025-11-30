// 個別の回答
export type Answer = {
  id: number;           // 1-24
  category: number;     // 1-8 (カテゴリー番号)
  index: number;        // 1-3 (カテゴリー内の順番)
  text: string;         // 回答内容
  purpose?: string;     // 2番目の回答のみ「それは何のため？」
  groupId?: string;     // グループID（まとめ画面で設定）
};

// グループ
export type Group = {
  id: string;
  label: string;        // グループ名
  color: string;        // グループカラー（HEX）
  answerIds: number[];  // このグループに属する回答ID
};

// 深掘り分析
export type Insight = {
  groupId: string;
  reflection: string;   // 「なぜそれをやるのか？」への回答
};

// 全体データ
export type UserData = {
  answers: Answer[];
  groups: Group[];
  insights: Insight[];
  timestamp: number;
};

// カテゴリー定義
export type Category = {
  id: number;
  title: string;
  description: string;
  guidance: string;
  examples: string[];
};

// 8つのカテゴリー
export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "空間の使い方",
    description: "あなたの空間を最も占めているものは何？",
    guidance: "自宅の自分のスペース（部屋、書斎等）や仕事場において置いているもの、飾っているもの、何に関連するものが多いか、特に目につくものを3つ挙げます。パソコンやスマートフォンがある人は、その中にあるアプリやウェブサイトを挙げてください。",
    examples: ["本棚に並ぶビジネス書", "デスクの上のカメラ機材", "壁に飾られた家族の写真"]
  },
  {
    id: 2,
    title: "時間の使い方",
    description: "あなたが最も時間を費やしている活動は何？",
    guidance: "あなたが最も時間を費やしていることは何？3つ挙げてみましょう。手帳やカレンダーで実際に確認してみましょう。",
    examples: ["読書で知識を得ること", "家族との時間", "仕事のプロジェクト"]
  },
  {
    id: 3,
    title: "エネルギーの注ぎ方",
    description: "あなたが最もエネルギーを注いでいるものは何？",
    guidance: "何をしているとき、活力が溢れてきますか？あなたが夢中になって取り組めること、また、それをする前よりする後の方が元気になるようなことを3つ挙げましょう。",
    examples: ["新しい技術の学習", "チームでの問題解決", "創作活動"]
  },
  {
    id: 4,
    title: "お金の使い方",
    description: "あなたが最もお金を使っていることは何？",
    guidance: "あなたが最もお金を使って買っているモノ、サービス、または情報は何？実際に自分が3ヶ月の間に使ったお金を思い出し、3つ書き出してみましょう。",
    examples: ["オンライン学習コース", "健康食品・サプリメント", "旅行・体験"]
  },
  {
    id: 5,
    title: "思考の傾向",
    description: "あなたが最もよく想像し、実現化しているものは何？",
    guidance: "あなたが最もよく想像している、人生で実現したいこと（なりたい状態、したいこと、手に入れたい物）は何？また、実現化している、実現に近づいていることは何？3つ挙げましょう。",
    examples: ["独立して自分のビジネスを持つ", "海外で働く経験", "専門性を高める"]
  },
  {
    id: 6,
    title: "コミュニケーション",
    description: "あなたがよく他人に話しかける話題は何？",
    guidance: "他人と話をするとき、どんな話題を持ちかけますか？または、SNSやブログで発信していることは何？相手と話したい、長時間話し続けていても楽しいことは何？3つ挙げましょう。",
    examples: ["最新のテクノロジー", "子育ての工夫", "趣味のアウトドア"]
  },
  {
    id: 7,
    title: "学習の方向性",
    description: "あなたが最も学びたい、知りたいことは何？",
    guidance: "あなたが最も知りたいこと、より深く学びたいこと、興味を抱いていることは何？よくネットで検索すること、書店でよく行くコーナーなどを考えながら3つ挙げましょう。",
    examples: ["AI・機械学習", "心理学", "投資・資産運用"]
  },
  {
    id: 8,
    title: "自己管理",
    description: "あなたが最も律することができているもの、整理整頓できているものは何？",
    guidance: "あなたが日常生活で、最も自分を制し、律することができていることは何？または、整理整頓できている場所、事柄は何？3つ挙げてみましょう。",
    examples: ["毎朝のランニング習慣", "デスク周りの整理", "タスク管理"]
  }
];
