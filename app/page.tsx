import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Briefcase, MessageSquare, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Briefcase className="h-3 w-3 text-primary-foreground" />
            </div>
            BikinKarya
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Masuk
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-background to-background" />
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              Buktikan Kemampuanmu,<br className="hidden sm:block" />
              <span className="text-primary/70">Bukan Sekadar CV.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Platform simulasi kerja untuk fresh graduate Indonesia. Dapatkan brief realistis dari AI, bangun portofolio profesional, dan menangkan interview-mu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base">
                  Mulai Simulasi Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                  Masuk ke Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Cara Kerja BikinKarya</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Kami membantu fresh graduate mengatasi siklus "butuh pengalaman untuk dapat kerja, butuh kerja untuk dapat pengalaman".</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm">
                <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Generate Brief Realistis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dapatkan studi kasus yang dirancang oleh AI sesuai standar industri saat ini (UI/UX, Graphic Design, Digital Marketing).
                </p>
              </div>
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <LayoutDashboard className="h-48 w-48" />
                </div>
                <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center mb-6 relative z-10">
                  <LayoutDashboard className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">2. Kerjakan di Kanban</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  Simulasikan workflow profesional dengan Kanban board. Latih kedisiplinan dan manajemen waktumu.
                </p>
              </div>
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm">
                <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Simulasi Interview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Uji pemahamanmu tentang proyek yang kamu kerjakan dengan simulasi pertanyaan teknis & behavioral langsung dari AI HR.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Siap Membangun Karirmu?</h2>
            <Link href="/register">
              <Button size="lg" className="h-12 px-8">Buat Akun Sekarang</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} BikinKarya. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <span className="hover:text-foreground cursor-pointer transition-colors">Syarat & Ketentuan</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Kebijakan Privasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
