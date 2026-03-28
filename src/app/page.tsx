import Analyzer from "@/components/Analyzer";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold leading-none transition-transform group-hover:scale-105">
                W
              </div>
              <span className="font-semibold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
                WebPulse
              </span>
            </a>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="text-foreground">วิเคราะห์ใหม่</span>
              <a href="/history" className="hover:text-foreground transition-colors">ประวัติการสแกน</a>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {/* Minimal grid background pattern */}
        <div className="absolute inset-0 z-[-1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgeD0iMCIgeT0iMCI+PHBhdGggZmlsbD0idHJhbnNwYXJlbnQiIGQ9Ik0wLDBIMjRWMjRIMEoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiBmaWxsPSIjOTNhM2FmIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-50 dark:opacity-20 mask-[radial-gradient(ellipse_at_center,black,transparent)]" />
        
        <div className="py-16 md:py-24">
          <Analyzer />
        </div>
      </main>

      {/* Footer */}
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
