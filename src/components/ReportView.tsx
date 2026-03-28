'use client';

import React from 'react';
import { CheckCircle2, Layout, ExternalLink, Globe, BarChart3, XCircle, AlertTriangle, Copy, Monitor, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AuditResult {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
}

interface AnalysisData {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  url: string;
  strategy?: 'mobile' | 'desktop';
  title?: string;
  description?: string;
  audits: AuditResult[];
  metrics: {
    lcp: string;
    fcp: string;
    cls: string;
    tbt: string;
    speedIndex: string;
    tti: string;
  };
}

const MinimalCircularProgress = ({ score, label }: { score: number, label: string }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getStrokeColor = () => {
    if (score >= 90) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 md:w-32 md:h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-border"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tracking-tighter ${getColor()}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
};

export default function ReportView({ data }: { data: AnalysisData }) {
  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-16"
    >
      {/* Toolbar & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
         <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${data.performance >= 90 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
               <CheckCircle2 size={32} />
            </div>
            <div>
               <h3 className="text-xl font-bold leading-tight">สรุปผลการวิเคราะห์</h3>
               <p className="text-muted-foreground text-sm">
                  {(() => {
                     const avg = (data.performance + data.accessibility + data.bestPractices + data.seo) / 4;
                     if (avg >= 90) return "ยอดเยี่ยม! เว็บไซต์ของคุณมีประสิทธิภาพสูงมากในทุกด้าน";
                     if (avg >= 70) return "ดีมาก! มีบางจุดที่สามารถปรับปรุงได้เพื่อให้สมบูรณ์แบบ";
                     if (avg >= 50) return "ปานกลาง! แนะนำให้แก้ไขตามรายการด้านล่างเพื่อประสบการณ์ผู้ใช้ที่ดีขึ้น";
                     return "ควรปรับปรุง! เว็บไซต์มีปัญหาหลายจุดที่อาจส่งผลต่อการเข้าถึงและอันดับ SEO";
                  })()}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="flex-1 md:flex-none px-5 py-2.5 bg-secondary text-foreground hover:bg-muted border border-border transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
               <Layout size={16} className="opacity-70" /> พิมพ์รายงาน
            </button>
            <button 
              onClick={() => {
                  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('คัดลอกลิงก์เรียบร้อยแล้ว');
              }}
              className="flex-1 md:flex-none px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
               <Copy size={16} /> แชร์ผลลัพธ์
            </button>
         </div>
      </div>

      {/* Strategy Indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-accent w-fit rounded-full text-xs font-bold">
        {data.strategy === 'mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
        วิเคราะห์แบบ: {data.strategy === 'mobile' ? 'มือถือ (Mobile)' : 'เดสก์ท็อป (Desktop)'}
      </div>

      {/* Overview Scores */}
      <section aria-labelledby="overview-heading" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <h2 id="overview-heading" className="sr-only">คะแนนรวม</h2>
        <div className="minimal-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <MinimalCircularProgress score={data.performance} label="ความเร็ว (Performance)" />
        </div>
        <div className="minimal-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <MinimalCircularProgress score={data.accessibility} label="การรองรับ (Accessibility)" />
        </div>
        <div className="minimal-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <MinimalCircularProgress score={data.bestPractices} label="แนวทางที่ดี (BestPractices)" />
        </div>
        <div className="minimal-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <MinimalCircularProgress score={data.seo} label="SEO" />
        </div>
      </section>

      {/* Google Snippet Preview */}
      {data.title && (
        <section aria-labelledby="preview-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 id="preview-heading" className="text-lg font-bold">ตัวอย่างบนผลการค้นหา (Google Snippet)</h2>
          </div>
          <div className="minimal-card rounded-2xl p-6 md:p-8 bg-[#ffffff] dark:bg-[#1a1a1a] border-border shadow-sm">
            <div className="max-w-xl space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] border border-border">
                  <Globe size={14} className="text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#202124] dark:text-[#bdc1c6] leading-tight font-medium">
                    {new URL(data.url).hostname}
                  </span>
                  <span className="text-[10px] text-[#70757a] dark:text-[#9aa0a6] leading-tight">
                    {data.url}
                  </span>
                </div>
              </div>
              <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-1">
                {data.title}
              </h3>
              <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                {data.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Core Metrics */}
      <section aria-labelledby="metrics-heading" className="minimal-card rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div>
            <h2 id="metrics-heading" className="text-lg font-bold">ข้อมูลสถิติที่สำคัญ (Core Web Vitals)</h2>
            <p className="text-xs text-muted-foreground mt-1 text-balance">ปัจจัยหลักที่ Google ใช้ในการจัดอันดับเว็บไซต์</p>
          </div>
          <BarChart3 className="text-muted-foreground hidden sm:block" size={24} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {[
            { title: 'First Contentful Paint', value: data.metrics.fcp, desc: 'เวลาที่เนื้อหาแรกแสดงผล' },
            { title: 'Largest Contentful Paint', value: data.metrics.lcp, desc: 'เวลาโหลดเนื้อหาภาพ/ข้อความที่ใหญ่ที่สุด' },
            { title: 'Cumulative Layout Shift', value: data.metrics.cls, desc: 'ความเสถียรของการจัดวาง ไม่กระตุก' },
            { title: 'Total Blocking Time', value: data.metrics.tbt, desc: 'เวลาบล็อกก่อนที่เว็บจะทำงานสมบูรณ์' },
            { title: 'Speed Index', value: data.metrics.speedIndex, desc: 'ความเร็วในการปรากฏเนื้อหา' },
            { title: 'Time to Interactive', value: data.metrics.tti, desc: 'เวลาจนกว่าเริ่มใช้งานและคลิดิตตอบสนองได้' },
          ].map((item, idx) => (
            <div key={idx} className="p-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase opacity-80 mb-1">{item.title}</p>
              <p className="text-2xl font-black mb-1 font-mono tracking-tight">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Opportunities */}
      <section aria-labelledby="opportunities-heading" className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 id="opportunities-heading" className="text-xl font-bold">จุดที่ควรปรับปรุง</h2>
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-bold px-2 py-1 rounded">
            {data.audits.length} รายการ
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.audits.map((audit) => (
            <div 
              key={audit.id}
              className="minimal-card rounded-xl p-5 hover:border-foreground/20 transition-colors"
            >
              <div className="flex gap-4">
                <div className="mt-0.5">
                  {audit.score === 0 ? (
                    <XCircle className="text-rose-500" size={18} />
                  ) : (
                    <AlertTriangle className="text-amber-500" size={18} />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-sm leading-snug">{audit.title}</h4>
                    {audit.displayValue && (
                      <span className="shrink-0 text-[10px] font-mono font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        ~ {audit.displayValue}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3" title={audit.description}>
                    {audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1').split('.')[0] + '.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {data.audits.length === 0 && (
             <div className="col-span-full minimal-card rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center">
               <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
               <p className="font-medium">เว็บไซต์ของคุณทำคะแนนได้ยอดเยี่ยม ไม่มีข้อแนะนำรุนแรงทางการแก้ไข</p>
             </div>
          )}
        </div>
      </section>

      <div className="text-center mt-12 mb-4 no-print">
         <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-accent px-4 py-2 rounded-full">
            <CheckCircle2 size={14} className="text-emerald-500" />
            ข้อมูลการสแกนล่าสุดสำหรับ {new URL(data.url).hostname}
         </div>
      </div>
    </motion.div>
  );
}
