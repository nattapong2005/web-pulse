'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, Zap, ShieldCheck, Accessibility, Globe, ArrowRight, CheckCircle2, AlertTriangle, XCircle, BarChart3, Info, ExternalLink, Cpu, Layout, Clock, Activity, Monitor, Smartphone, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ReportView from '@/components/ReportView';

const API_KEY = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY;

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
  strategy: 'mobile' | 'desktop';
  title: string;
  description: string;
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

export default function Analyzer() {
  const [url, setUrl] = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('desktop');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlParam = searchParams.get('url');
    const strategyParam = searchParams.get('strategy') as 'mobile' | 'desktop';
    if (urlParam) {
      setUrl(urlParam);
      if (strategyParam === 'mobile' || strategyParam === 'desktop') {
        setStrategy(strategyParam);
      }
      triggerAutoAnalysis(urlParam);
    }
  }, [searchParams]);

  const triggerAutoAnalysis = (targetUrl: string) => {
    setTimeout(() => {
       const formEvent = { preventDefault: () => {} } as React.FormEvent;
       analyze(formEvent, targetUrl);
    }, 100);
  };

  const analyze = async (e: React.FormEvent, manualUrl?: string) => {
    e.preventDefault();
    let currentUrl = (manualUrl || url).trim();
    if (!currentUrl) return;

    if (!/^https?:\/\//i.test(currentUrl)) {
      currentUrl = `https://${currentUrl}`;
      setUrl(currentUrl);
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
      setLoadingStep('กำลังติดต่อเซิร์ฟเวอร์ Lighthouse...');
      
      const fetchedCategories = await Promise.all(
        categories.map(async (category, index) => {
          const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(currentUrl)}&category=${category}&strategy=${strategy}&key=${API_KEY}`);
          if (index === 1) setLoadingStep('วิเคราะห์ประสิทธิภาพและความเร็ว...');
          if (index === 2) setLoadingStep('ตรวจสอบ SEO และ Accessibility...');
          return res.json();
        })
      );

      const base = fetchedCategories[0];
      if (base.error) {
        if (base.error.code === 400) throw new Error('URL ไม่ถูกต้องหรือไม่สามารถเข้าถึงได้');
        if (base.error.code === 429) throw new Error('เรียกใช้ API เกินขีดจำกัด กรุณารอสักครู่');
        throw new Error(base.error.message);
      }

      setLoadingStep('กำลังเขียนสรุปผลการวิเคราะห์...');
      const lh = base.lighthouseResult;
      
      const results: AnalysisData = {
        url: lh.requestedUrl,
        strategy: strategy,
        title: lh.audits['document-title']?.displayValue || new URL(lh.requestedUrl).hostname,
        description: lh.audits['meta-description']?.displayValue || 'ไม่มีข้อมูล Meta Description สำหรับเว็บไซต์นี้',
        performance: Math.round(lh.categories.performance.score * 100),
        accessibility: Math.round(fetchedCategories[1].lighthouseResult.categories.accessibility.score * 100),
        bestPractices: Math.round(fetchedCategories[2].lighthouseResult.categories['best-practices'].score * 100),
        seo: Math.round(fetchedCategories[3].lighthouseResult.categories.seo.score * 100),
        audits: Object.values(lh.audits)
          .filter((audit: any) => audit.score !== null && audit.score < 0.9)
          .map((audit: any) => ({
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue
          }))
          .sort((a, b) => (a.score || 0) - (b.score || 0))
          .slice(0, 15),
        metrics: {
          lcp: lh.audits['largest-contentful-paint']?.displayValue || '-',
          fcp: lh.audits['first-contentful-paint']?.displayValue || '-',
          cls: lh.audits['cumulative-layout-shift']?.displayValue || '-',
          tbt: lh.audits['total-blocking-time']?.displayValue || '-',
          speedIndex: lh.audits['speed-index']?.displayValue || '-',
          tti: lh.audits['interactive']?.displayValue || '-',
        }
      };

      setData(results);

      supabase.from('analysis_history').insert([{
        url: results.url,
        performance: results.performance,
        accessibility: results.accessibility,
        best_practices: results.bestPractices,
        seo: results.seo,
        metrics: results.metrics,
        opportunities: results.audits,
        strategy: strategy
      }]).then(({ error }) => {
        if (error) console.error("Supabase Save Error:", error);
      });

    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาตรวจสอบ URL หรือลองอีกครั้งในภายหลัง');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-accent text-accent-foreground text-xs font-bold tracking-widest uppercase mb-4 border border-border">
          Lighthouse Powered
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-primary">
          วิเคราะห์เว็บไซต์ <br className="hidden md:block" />
          <span className="text-muted-foreground font-normal">ภายในคลิกเดียว.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          ความเร็ว (Speed), การเข้าถึง (Accessibility), และ SEO รวมครบทุกการวิเคราะห์ในหน้าเดียวด้วย Google PageSpeed Insights
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6 mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <form onSubmit={analyze} className="relative">
          <label htmlFor="url-input" className="sr-only">ระบุที่อยู่เว็บไซต์</label>
          <div className="flex items-center bg-card border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary focus-within:border-primary shadow-sm overflow-hidden transition-all">
            <div className="pl-4 text-muted-foreground mr-2">
              <Globe size={20} />
            </div>
            <input 
              id="url-input"
              type="text" 
              placeholder="https://your-website.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent py-4 outline-none text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
            {url && !loading && (
              <button 
                type="button" 
                onClick={() => setUrl('')}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors mr-1"
                aria-label="ลบข้อความ"
              >
                <XCircle size={18} />
              </button>
            )}
            <button 
              type="submit"
              disabled={loading || !url}
              className="bg-primary text-primary-foreground font-semibold px-6 py-4 transition-colors disabled:opacity-50 hover:opacity-90 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span>วิเคราะห์</span>
              )}
              {!loading && <ArrowRight size={18} className="hidden sm:inline" />}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-4">
           {[
             { id: 'desktop', label: 'เดสก์ท็อป', icon: Monitor },
             { id: 'mobile', label: 'มือถือ', icon: Smartphone }
           ].map((opt) => (
             <button
               key={opt.id}
               type="button"
               disabled={loading}
               onClick={() => setStrategy(opt.id as any)}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${strategy === opt.id ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/30 scale-105 ring-2 ring-primary/20' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/30'}`}
             >
               <opt.icon size={16} />
               {opt.label}
             </button>
           ))}
        </div>
        
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground font-medium">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
               {loadingStep}
             </div>
             <div className="w-full max-w-xs h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, repeat: Infinity }}
                />
             </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-10 p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-500 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} />
              <p className="text-sm font-semibold">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1 opacity-80 hover:opacity-100 transition-opacity">
              <XCircle size={18} />
            </button>
          </motion.div>
        )}

        {loading && !data && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="space-y-12 pb-16"
           >
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="minimal-card h-40 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-secondary mb-4" />
                    <div className="w-24 h-4 bg-secondary rounded" />
                 </div>
               ))}
             </div>
             <div className="minimal-card h-48 rounded-2xl animate-pulse bg-secondary/50" />
             <div className="minimal-card h-64 rounded-2xl animate-pulse bg-secondary/50" />
           </motion.div>
        )}

        {data && <ReportView data={data} />}
      </AnimatePresence>
    </div>
  );
}
