import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "綿貫晃雅 — 高性能計算・コンパイラ",
  description: "高性能計算とコンパイラを研究する綿貫晃雅のポートフォリオ。",
  openGraph: {
    locale: "ja_JP",
    title: "綿貫晃雅 — 高性能計算・コンパイラ",
    description: "高性能計算とコンパイラを研究する綿貫晃雅のポートフォリオ。",
  },
};

export default function JapaneseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div lang="ja">{children}</div>;
}
