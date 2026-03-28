import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from 'sonner';
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WebPulse - วิเคราะห์ SEO, ความเร็ว & ประสิทธิภาพเว็บไซต์",
  description: "เครื่องมือวิเคราะห์เว็บไซต์และ SEO ฟรี ช่วยตรวจสอบความเร็ว (Performance), การเข้าถึง (Accessibility) และแนวทางปฏิบัติที่ดีที่สุด (Best Practices) อย่างละเอียด",
  keywords: "วิเคราะห์เว็บ, เช็ค SEO, ความเร็วเว็บ, ตัวเช็คความเร็วเว็บไซต์, เครื่องมือสร้างเว็บ, PageSpeed, Core Web Vitals, ตรวจเว็บไซต์ฟรี",
  openGraph: {
    title: "WebPulse - ตรวจสอบ SEO และประสิทธิภาพ",
    description: "เครื่องมือตรวจสอบเว็บไซต์ระดับพรีเมียม วิเคราะห์ความเร็วและ SEO ภายในคลิกเดียว",
    locale: "th_TH",
    type: "website",
    siteName: "WebPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebPulse - SEO Analyzer",
    description: "Analyze your website performance, accessibility and SEO in one click.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
