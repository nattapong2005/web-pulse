'use client';

import React, { useEffect, useState } from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft, Clock, Globe, BarChart3, ChevronDown, ChevronUp,
  Activity, Zap, ShieldCheck, Accessibility, Trash2, Search, ExternalLink, RefreshCcw, Loader2, Monitor, Smartphone, FileText
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryItem {
  id: string;
  created_at: string;
  url: string;
  performance: number;
  accessibility: number;
  best_practices: number;
  seo: number;
  metrics?: any;
  opportunities?: any[];
  strategy?: 'mobile' | 'desktop';
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัตินี้?')) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(prev => prev.filter(item => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredHistory = history.filter(item =>
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-500 bg-amber-500/10';
    return 'text-rose-500 bg-rose-500/10';
  };

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/10">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
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
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground transition-colors">
              <Link href="/" className="hover:text-foreground">วิเคราะห์ใหม่</Link>
              <span className="text-foreground border-b-2 border-primary pt-1">ประวัติการสแกน</span>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full relative">
        <div className="absolute inset-0 z-[-1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgeD0iMCIgeT0iMCI+PHBhdGggZmlsbD0idHJhbnNwYXJlbnQiIGQ9Ik0wLDBIMjRWMjRIMEoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiBmaWxsPSIjOTNhM2FmIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-50 dark:opacity-20 mask-[radial-gradient(ellipse_at_center,black,transparent)]" />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">ประวัติการวิเคราะห์</h1>
              <p className="text-muted-foreground">รวมข้อมูลการตรวจสอบเว็บไซต์ทั้งหมดของคุณที่เคยบันทึกไว้</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="ค้นหา URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="minimal-card p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Activity size={24} /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">สแกนทั้งหมด</p>
                <p className="text-2xl font-black">{history.length}</p>
              </div>
            </div>
            <div className="minimal-card p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Zap size={24} /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">เฉลี่ย Performance</p>
                <p className="text-2xl font-black">
                  {history.length ? Math.round(history.reduce((a, b) => a + b.performance, 0) / history.length) : 0}
                </p>
              </div>
            </div>
            <div className="minimal-card p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">เฉลี่ย SEO</p>
                <p className="text-2xl font-black">
                  {history.length ? Math.round(history.reduce((a, b) => a + b.seo, 0) / history.length) : 0}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="minimal-card p-8 rounded-2xl animate-pulse space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-muted rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="w-1/3 h-5 bg-muted rounded" />
                      <div className="w-1/4 h-3 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="minimal-card rounded-2xl p-16 text-center text-muted-foreground flex flex-col items-center border-dashed border-2">
              <Search size={48} className="text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">ไม่พบผลลัพธ์</h2>
              <p className="mb-6">ลองค้นหาด้วยคำอื่น หรือเริ่มวิเคราะห์เว็บไซต์ใหม่</p>
              <Link href="/" className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-all">วิเคราะห์ใหม่</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="minimal-card rounded-2xl overflow-hidden transition-all duration-300">
                  <div
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0 group-hover:bg-primary/10 transition-colors">
                        <Globe size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                          {new URL(item.url).hostname}
                          <ExternalLink size={12} className="opacity-40" />
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary rounded-full font-bold uppercase text-[9px] tracking-tight">
                            {item.strategy === 'mobile' ? <Smartphone size={10} /> : <Monitor size={10} />}
                            {item.strategy || 'desktop'}
                          </div>
                          <div className="flex items-center gap-1 opacity-60">
                            <Clock size={12} />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold ${getScoreColor(item.performance)}`}>
                        P: {item.performance}
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold ${getScoreColor(item.accessibility)}`}>
                        A: {item.accessibility}
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold ${getScoreColor(item.best_practices)}`}>
                        BP: {item.best_practices}
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold ${getScoreColor(item.seo)}`}>
                        S: {item.seo}
                      </div>
                      <div className="ml-2 pl-2 border-l border-border flex items-center gap-2 text-muted-foreground">
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          disabled={isDeleting === item.id}
                          className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-all"
                        >
                          {isDeleting === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                        {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-secondary/20 overflow-hidden"
                      >
                        <div className="p-8 space-y-8">
                          {/* Detailed metrics snapshot */}
                          {item.metrics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {Object.entries(item.metrics).map(([key, val]: [string, any]) => (
                                <div key={key} className="space-y-1">
                                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{key}</p>
                                  <p className="text-xl font-bold font-mono">{val}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Opportunities snapshot */}
                          <div className="space-y-4">
                            <p className="text-sm font-bold flex items-center gap-2">
                              <Activity size={16} className="text-amber-500" />
                              จุดที่ควรปรับปรุง ณ วันที่บันทึก
                            </p>
                            <div className="grid gap-3">
                              {item.opportunities?.slice(0, 3).map((opp: any, idx: number) => (
                                <div key={idx} className="bg-card border border-border/50 rounded-xl p-4 flex items-start gap-3">
                                  <div className="mt-1"><Zap size={14} className="text-amber-500" /></div>
                                  <div className="flex-1">
                                    <div className="flex justify-between gap-4 mb-1">
                                      <p className="text-xs font-bold">{opp.title}</p>
                                      {opp.displayValue && <span className="text-[10px] font-mono opacity-60">~ {opp.displayValue}</span>}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-1">{opp.description}</p>
                                  </div>
                                </div>
                              ))}
                              {!item.opportunities?.length && <p className="text-xs text-muted-foreground italic">ไม่มีข้อมูลจุดที่ควรปรับปรุง</p>}
                            </div>
                          </div>

                           <div className="pt-4 flex flex-wrap gap-3">
                            <Link
                              href={`/report/${item.id}`}
                              className="text-xs font-bold px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:opacity-90 transition-all border border-primary shrink-0"
                            >
                              <FileText size={14} /> ดูรายงานฉบับเต็ม
                            </Link>
                            <Link
                              href={`/?url=${encodeURIComponent(item.url)}&strategy=${item.strategy || 'desktop'}`}
                              className="text-xs font-bold px-4 py-2 bg-secondary text-foreground rounded-lg flex items-center gap-2 hover:bg-border transition-all border border-border shrink-0"
                            >
                              <RefreshCcw size={14} /> วิเคราะห์ใหม่อีกครั้ง
                            </Link>
                            <a
                              href={item.url}
                              target="_blank"
                              className="text-xs font-bold px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-secondary transition-all shrink-0"
                            >
                              <ExternalLink size={14} /> เปิดเว็บไซต์
                            </a>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-tight">WebPulse</p>
            <p className="text-sm text-muted-foreground mt-1">เครื่องมือตรวจสอบความเร็วและประสิทธิภาพเว็บไซต์</p>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WebPulse. สงวนลิขสิทธิ์
          </p>
        </div>
      </footer>
    </div>
  );
}
