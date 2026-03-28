# WebPulse - เครื่องมือวิเคราะห์ประสิทธิภาพเว็บไซต์ (SEO Analyzer)

WebPulse เป็นแอปพลิเคชันสำหรับตรวจสอบและวิเคราะห์ประสิทธิภาพของเว็บไซต์ (Lighthouse Analysis) โดยใช้เทคโนโลยี Google PageSpeed Insights API เพื่อให้ข้อมูลเจาะลึกในด้านความเร็ว การเข้าถึง มาตรฐานการเขียนโค้ด และ SEO

## คุณสมบัติหลัก

*   วิเคราะห์เว็บไซต์ได้ทั้งรูปแบบ เดสก์ท็อป (Desktop) และ มือถือ (Mobile)
*   แสดงคะแนนรวม 4 ด้านหลัก: Performance, Accessibility, Best Practices และ SEO
*   แสดงข้อมูลสถิติที่สำคัญ (Core Web Vitals) เช่น LCP, FCP, CLS และ TBT
*   ระบบแสดงตัวอย่างผลการค้นหาบน Google (Google Snippet Preview)
*   บันทึกประวัติการวิเคราะห์โดยอัตโนมัติลงในฐานข้อมูล
*   มีหน้ารายงานผลแบบละเอียดเฉพาะตัว (Dedicated Report Page) ที่สามารถแชร์ต่อได้
*   รองรับโหมดสว่าง (Light Mode) และโหมดมืด (Dark Mode) อย่างสมบูรณ์
*   ระบบแจ้งเตือนที่ทันสมัยและส่วนติดต่อผู้ใช้ที่เน้นความเร็ว

## เทคโนโลยีที่ใช้

*   Framework: Next.js (App Router)
*   Styling: Tailwind CSS
*   Animation: Framer Motion
*   Database: Supabase
*   Icons: Lucide React
*   Notifications: Sonner
*   API: Google PageSpeed Insights API

## การเริ่มต้นใช้งาน

1. ติดตั้ง dependencies
```bash
npm install
```

2. ตั้งค่าไฟล์ .env
สร้างไฟล์ .env และระบุค่าต่อไปนี้:
```
NEXT_PUBLIC_PAGESPEED_API_KEY=รหัส_API_ของคุณ
NEXT_PUBLIC_SUPABASE_URL=URL_ของ_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=คีย์_ของ_SUPABASE
```

3. รันโปรเจคในโหมดพัฒนา
```bash
npm run dev
```

4. เปิดบราวเซอร์ไปที่ http://localhost:3000

## โครงสร้างโปรเจค

*   /src/app - จัดการ routing และหน้าหลักของแอปพลิเคชัน
*   /src/components - รวมคอมโพเนนต์หลักที่ใช้ซ้ำได้ เช่น Analyzer, ReportView, ThemeToggle
*   /src/lib - จัดการการเชื่อมต่อกับบริการภายนอก เช่น Supabase

## การปรับใช้ (Deployment)

สามารถนำโปรเจคนี้ไป deploy บน Vercel หรือผู้ให้บริการอื่นๆ ที่รองรับ Node.js ได้อย่างง่ายดาย

ลิขสิทธิ์และอำนาจการจัดการโดยทีมพัฒนา WebPulse
