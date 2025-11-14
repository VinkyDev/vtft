import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import 'ui/globals.css'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VTFT - 云顶之弈数据助手",
  description: "一站式云顶之弈数据查询平台，提供英雄、装备、羁绊、强化符文等全方位数据支持，助你在战场上所向披靡",
  keywords: ["云顶之弈", "TFT", "数据助手", "英雄数据", "装备合成", "羁绊系统", "强化符文"],
  authors: { name: "VinkyDev" },
  icons: {
    icon: 'https://i.imgs.ovh/2025/11/14/CaAxWL.png',
  },
  openGraph: {
    title: "VTFT - 云顶之弈数据助手",
    description: "一站式云顶之弈数据查询平台，提供英雄、装备、羁绊、强化符文等全方位数据支持",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
