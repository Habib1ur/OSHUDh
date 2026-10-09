import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oshudh Healthcare",
  description:
    "Healthcare e-commerce storefront for medicines, wellness, doctor consultations, and lab tests.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
