'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';
import ReportView from '@/components/ReportView';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  async function fetchReport() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('ไม่พบข้อมูลรายงานนี้');

      // Transform DB data to matching AnalysisData interface if needed
      setData({
        ...data,
        bestPractices: data.best_practices,
        audits: data.opportunities || []
      });
    } catch (err: any) {
      console.error("Failed to load report:", err);
      setError(err.message || 'ไม่สามารถโหลดข้อมูลรายงานได้');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/10">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md no-print">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold leading-none transition-transform group-hover:scale-105">
                W
              </div>
              <span className="font-semibold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
                WebPulse
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/history" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} /> กลับไปยังประวัติ
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        <div className="absolute inset-0 z-[-1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgeD0iMCIgeT0iMCI+PHBhdGggZmlsbD0idHJhbnNwYXJlbnQiIGQ9Ik0wLDBIMjRWMjRIMEoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiBmaWxsPSIjOTNhM2FmIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-50 dark:opacity-20 mask-[radial-gradient(ellipse_at_center,black,transparent)]" />
        
        <div className="max-w-5xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-primary" size={48} />
              <p className="text-muted-foreground font-medium">กำลังโหลดรายงานการวิเคราะห์...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full">
                <AlertTriangle size={48} />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h1>
                <p className="text-muted-foreground max-w-md">{error}</p>
              </div>
              <Link href="/history" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90">
                กลับไปยังหน้าประวัติ
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 no-print">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">รายงานการวิเคราะห์</h1>
                <p className="text-muted-foreground">ข้อมูลการตรวจสอบละเอียดสำหรับ: {data.url}</p>
              </div>
              <ReportView data={data} />
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-background py-8 no-print">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WebPulse. ผลการวิเคราะห์จาก Google Lighthouse
          </p>
        </div>
      </footer>
    </div>
  );
}
