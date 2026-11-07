import { Cairo, Inter } from "next/font/google";
import "@/styles/globals.css";
import "../styles/norama.css";

const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07111f",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="">
      <body className={`${cairo.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
