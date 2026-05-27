import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "听墨 | 音视频转写与字幕工具",
  description: "录音生成会议纪要，视频生成可编辑字幕的可点击产品原型。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
