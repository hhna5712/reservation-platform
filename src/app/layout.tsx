import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reservation Platform - 네이버 예약 연동 플랫폼",
  description: "네이버 예약과 연동되는 예약 관리 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
