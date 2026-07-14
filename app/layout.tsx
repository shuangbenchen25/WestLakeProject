import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西湖无障碍导览",
  description: "西湖十景视障与听障导览。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/quyuan-fenghe.jpg" type="image/jpeg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
