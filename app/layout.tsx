import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "./i18n";
import { publicAsset } from "./site-path";
import LegacyPwaCleanup from "./components/LegacyPwaCleanup";

export const metadata: Metadata = {
  title: "西湖无障碍导览 | Accessible West Lake Guide",
  description: "西湖十景视障与听障中英双语导览。Bilingual accessible guide to West Lake.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href={publicAsset("quyuan-fenghe.jpg")} type="image/jpeg" />
      </head>
      <body><I18nProvider><LegacyPwaCleanup />{children}</I18nProvider></body>
    </html>
  );
}
