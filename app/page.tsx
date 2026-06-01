"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { HiArrowRight, HiSparkles, HiBriefcase, HiChatBubbleLeftEllipsis, HiViewColumns, HiArrowUpRight } from "react-icons/hi2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const testimonials = [
  { name: "Andi S.", role: "UI/UX Designer", content: "BikinKarya bantu saya dapet portfolio yang bikin HRD notice. Brief-nya kerasa kayak project beneran!" },
  { name: "Budi P.", role: "Digital Marketer", content: "Simulasi interview-nya ngebantu banget ngurangin grogi. Sekarang saya lebih pede jawab pertanyaan teknis." },
  { name: "Citra W.", role: "Graphic Designer", content: "Kanban board-nya bikin saya terbiasa sama workflow agency. Sangat recommended buat fresh grad!" },
  { name: "Dewi Nor", role: "Product Manager", content: "Nggak nyangka dapet case study se-relatable ini. Hasil kerjanya langsung saya masukin CV." },
  { name: "Apis R.", role: "Frontend Developer", content: "Sistemnya gampang dipake dan kerasa banget vibe profesionalnya. Good job BikinKarya!" }
];

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".nav-item",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );

    tl.fromTo(
      ".hero-text",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out" },
      "-=0.5"
    );

    gsap.fromTo(
      ".feature-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 75%",
        }
      }
    );

    gsap.fromTo(
      ".testimonial-section",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testimonial-section",
          start: "top 80%",
        }
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary selection:text-black">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navbar */}
      <header className="h-[64px] bg-background/70 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 shadow-sm shadow-black/5">
        <div className="container mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="nav-item flex items-center gap-2.5 font-extrabold text-[17px] text-foreground tracking-tight">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <HiBriefcase className="h-3.5 w-3.5 text-[#000000]" />
            </div>
            BikinKarya
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="nav-item text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </a>
            <a href="#testimonials" className="nav-item text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimoni
            </a>
            <a href="#cta" className="nav-item text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="nav-item hidden sm:block text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Masuk
            </Link>
            <div className="nav-item">
              <Link href="/register">
                <Button size="sm" className="rounded-md text-[12px] sm:text-[13px] px-3 sm:px-5 h-8 font-semibold">
                  Daftar
                </Button>
              </Link>
            </div>
            <div className="nav-item ml-1 pl-2 sm:pl-3 border-l border-border flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ───────────── HERO SECTION ───────────── */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">

          {/* ── Beautiful Animated Gradient Background ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            {/* Base Background */}
            <div className="absolute inset-0 bg-background z-0"></div>

            {/* Colorful Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-[#EAB308]/40 dark:bg-primary/20 blur-[80px] md:blur-[100px] animate-pulse z-0" style={{ animationDuration: '8s' }}></div>
            <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-[#F5C542]/50 dark:bg-primary/10 blur-[90px] md:blur-[120px] animate-pulse z-0" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
            <div className="absolute bottom-[-10%] left-[15%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-[#F59E0B]/30 dark:bg-primary/15 blur-[80px] md:blur-[100px] animate-pulse z-0" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>

            {/* Subtle Grid Overlay for Texture */}
            <div className="absolute inset-0 z-20 bg-[linear-gradient(to_right,rgba(245,197,66,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,66,0.4)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(245,197,66,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,66,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
            
            {/* Bottom Fade to match the next section */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-20"></div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-12 md:py-20 mt-16 md:mt-0">
              <div className="hero-text inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full border border-primary/20 bg-primary/10">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary text-[12px] md:text-[13px] font-semibold tracking-widest uppercase">AI-Powered Platform</span>
              </div>
              <h1 className="hero-text text-[36px] sm:text-[42px] md:text-[56px] lg:text-[72px] font-black tracking-tighter mb-4 md:mb-6 leading-[1.1] text-foreground">
                Buktikan Kemampuanmu,<br className="hidden md:block" />
                <span className="text-primary">Bukan Sekadar CV.</span>
              </h1>
              <p className="hero-text text-[14px] sm:text-[15px] md:text-[18px] text-muted-foreground mb-10 max-w-2xl mx-auto leading-[1.6] font-medium">
                Platform simulasi kerja untuk fresh graduate Indonesia. Dapatkan brief realistis dari AI, bangun portofolio profesional, dan menangkan interview-mu.
              </p>
              <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-[15px] font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Mulai Gratis <HiArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-[15px] font-semibold border-border hover:border-primary/50 hover:bg-muted transition-colors bg-background/50 backdrop-blur-sm">
                    Lihat Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Marquee */}
        <section id="testimonials" className="testimonial-section py-20 bg-card border-y border-border overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-foreground max-w-md leading-tight">
              Dipercaya oleh Ratusan Fresh Graduate
            </h2>
            <p className="text-muted-foreground font-medium max-w-sm text-[16px]">
              Bergabunglah dengan mereka yang telah berhasil membangun portofolio profesional.
            </p>
          </div>
          <div className="relative w-full flex overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none"></div>
            <div className="flex gap-6 animate-scroll w-max pr-6">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="w-[400px] bg-background border border-border rounded-xl p-8 shadow-sm flex-shrink-0 hover:border-primary/50 transition-colors">
                  <p className="text-[16px] text-muted-foreground leading-relaxed mb-8">"{t.content}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center font-bold text-lg text-foreground border border-border">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-foreground">{t.name}</div>
                      <div className="text-[14px] text-primary font-medium">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section py-[120px] bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-20 flex flex-col lg:flex-row items-start justify-between gap-10">
              <div className="max-w-xl hero-text">
                <h2 className="text-[40px] md:text-[56px] font-bold tracking-tight mb-6 text-foreground leading-[1.1]">
                  Cara Kerja<br />BikinKarya
                </h2>
              </div>
              <p className="text-muted-foreground max-w-lg text-[18px] md:text-[20px] leading-relaxed font-medium hero-text lg:mt-4">
                Kami membantu fresh graduate mengatasi siklus "butuh pengalaman untuk dapat kerja, butuh kerja untuk dapat pengalaman".
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="feature-card lg:col-span-2 bg-card rounded-2xl p-8 md:p-12 lg:p-16 border border-border shadow-sm group hover:border-primary/50 transition-colors relative overflow-hidden">
                <div className="absolute -bottom-24 -right-24 opacity-5 group-hover:opacity-10 transition-opacity">
                  <HiSparkles className="w-96 h-96 text-foreground" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start justify-between h-full">
                  <div className="flex-1">
                    <div className="h-14 w-14 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
                      <HiSparkles className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-[28px] md:text-[36px] font-bold mb-4 text-foreground tracking-tight">1. Generate Brief Realistis</h3>
                    <p className="text-[18px] text-muted-foreground leading-relaxed max-w-lg">
                      Dapatkan studi kasus yang dirancang oleh AI sesuai standar industri saat ini (UI/UX, Graphic Design, Digital Marketing).
                    </p>
                  </div>
                  <div className="w-full md:w-1/3 mt-auto hidden md:flex justify-end">
                    <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                      <HiArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="feature-card bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm group hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
                  <HiViewColumns className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-[24px] md:text-[28px] font-bold mb-4 text-foreground tracking-tight">2. Kerjakan di Kanban</h3>
                <p className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed">
                  Simulasikan workflow profesional dengan Kanban board. Latih kedisiplinan dan manajemen waktumu.
                </p>
              </div>

              <div className="feature-card bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm group hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
                  <HiChatBubbleLeftEllipsis className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-[24px] md:text-[28px] font-bold mb-4 text-foreground tracking-tight">3. Simulasi Interview</h3>
                <p className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed">
                  Uji pemahamanmu tentang proyek yang kamu kerjakan dengan simulasi pertanyaan teknis & behavioral langsung dari AI HR.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-[120px] bg-primary text-[#000000] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
          <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-[48px] md:text-[64px] font-black tracking-tighter mb-6 leading-[1.1]">
                Siap Membangun Karirmu?
              </h2>
              <p className="text-[20px] font-medium opacity-90 max-w-lg">
                Jangan biarkan CV kosong menghambat impianmu. Mulai bangun portofolio profesionalmu hari ini.
              </p>
            </div>
            <div className="w-full md:w-auto flex-shrink-0">
              <Link href="/register">
                <Button size="lg" className="rounded-md h-16 px-12 text-[18px] font-bold bg-[#000000] text-primary hover:bg-[#1a1a1a] shadow-xl hover:shadow-2xl transition-all w-full md:w-auto">
                  Buat Akun Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background pt-20 pb-10 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 font-extrabold text-2xl text-foreground tracking-tight mb-6">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <HiBriefcase className="h-4 w-4 text-[#000000]" />
                </div>
                BikinKarya
              </div>
              <p className="text-muted-foreground text-[16px] max-w-sm leading-relaxed">
                Platform simulasi kerja pertama di Indonesia yang menghubungkan teori akademik dengan kebutuhan industri nyata.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[18px] text-foreground mb-6">Layanan</h4>
              <ul className="space-y-4 text-[15px] font-medium text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary transition-colors">AI Brief Generator</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Kanban Board</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Simulasi Interview</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Public Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[18px] text-foreground mb-6">Perusahaan</h4>
              <ul className="space-y-4 text-[15px] font-medium text-muted-foreground">
                <li><span className="hover:text-primary cursor-pointer transition-colors">Tentang Kami</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Karir</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Syarat & Ketentuan</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Kebijakan Privasi</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-muted-foreground font-medium">
            <p>&copy; {new Date().getFullYear()} BikinKarya. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-foreground cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">LinkedIn</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Instagram</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}