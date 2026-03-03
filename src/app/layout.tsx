import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Coffee Ops Hub",
    template: "%s | Coffee Ops Hub",
  },
  description:
    "A mobile-first operations hub for owner planning, task handoff, and shared business visibility.",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#0b1713",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
