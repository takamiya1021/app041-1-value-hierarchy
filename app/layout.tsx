import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "価値の序列 - 自己分析アプリ",
  description: "あなたの本当の価値観を発見する自己分析ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
