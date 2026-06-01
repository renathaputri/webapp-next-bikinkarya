"use client";

import { useState, useEffect } from "react";
import { HiSparkles, HiCheckCircle, HiRocketLaunch, HiClock, HiChatBubbleLeftEllipsis, HiBugAnt } from "react-icons/hi2";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FeatureGuide } from "@/components/ui/feature-guide";

export default function UpdatesPage() {
  const [username, setUsername] = useState("");
  const [isBugOpen, setIsBugOpen] = useState(false);
  const [bugMessage, setBugMessage] = useState("");
  const [isSendingBug, setIsSendingBug] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.username) {
          setUsername(data.data.username);
        }
      })
      .catch(() => {}); // silent fail for username
  }, []);

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugMessage.trim()) return;

    setIsSendingBug(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/lyonerena@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          username: username || "Anonymous", 
          pesan_bug: bugMessage,
          _subject: `Laporan Bug BikinKarya dari @${username || "Anonymous"}`,
          _template: "table",
          _captcha: "false"
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim laporan");

      toast.success("Thanks ya! Laporan bug-nya udah kekirim.");
      setIsBugOpen(false);
      setBugMessage("");
    } catch (error) {
      toast.error("Waduh, gagal ngirim nih. Cek koneksi internetmu ya.");
    } finally {
      setIsSendingBug(false);
    }
  };

  const updates = [
    {
      version: "v1.2.0",
      status: "Segera Datang",
      date: "Coming Soon",
      title: "Simulasi Interview Suara",
      description: "Berlatih wawancara kerja secara real-time dengan rekruter AI menggunakan fitur pengenalan suara interaktif.",
      isUpcoming: true,
      icon: HiSparkles,
    },
    {
      version: "v1.1.0",
      status: "Segera Datang",
      date: "Coming Soon",
      title: "Export PDF Portofolio",
      description: "Kini kamu bisa mengunduh seluruh portofolio publikmu menjadi file PDF profesional yang siap dikirimkan ke HRD.",
      isUpcoming: true,
      icon: HiRocketLaunch,
    },
    {
      version: "v1.0.1",
      status: "Rilis",
      date: "Hari Ini",
      title: "Notifikasi Cerdas & Validasi",
      description: "Pembaruan sistem notifikasi menggunakan pop-up (toast) yang modern dan penambahan validasi keamanan password.",
      isUpcoming: false,
      icon: HiCheckCircle,
    },
    {
      version: "v1.0.0",
      status: "Rilis",
      date: "Minggu Lalu",
      title: "Peluncuran BikinKarya",
      description: "BikinKarya resmi diluncurkan! Platform simulasi kerja dengan dukungan AI untuk membantu kreator Indonesia.",
      isUpcoming: false,
      icon: HiCheckCircle,
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Updates & Roadmap</h1>
          <p className="text-muted-foreground mt-2">
            Pantau pembaruan terbaru BikinKarya dan fitur-fitur seru yang akan segera datang.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setIsBugOpen(true)}>
            <HiBugAnt className="mr-2 h-4 w-4" /> Lapor Bug
          </Button>
        </div>
      </div>

      <div className="relative border-l border-border/80 ml-4 py-4 space-y-10">
        {updates.map((update, index) => (
          <div key={index} className="relative pl-8">
            <span className={`absolute -left-[17px] top-1.5 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center ${update.isUpcoming ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <update.icon className="h-4 w-4" />
            </span>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{update.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={update.isUpcoming ? "default" : "secondary"} className="text-[10px] uppercase tracking-wider">
                  {update.version}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center">
                  <HiClock className="mr-1 h-3 w-3" />
                  {update.date}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {update.description}
            </p>
          </div>
        ))}
      </div>

      {/* Bug Report Modal */}
      {isBugOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-red-500">
                <HiBugAnt className="h-6 w-6" />
                Laporan Bug
              </CardTitle>
              <CardDescription>
                Bantu kami memperbaiki BikinKarya dengan melaporkan error atau kendala teknis.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleBugSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bug-username">Username</Label>
                  <Input 
                    id="bug-username" 
                    value={username} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bug-message">Detail Bug / Error</Label>
                  <textarea
                    id="bug-message"
                    required
                    maxLength={3000}
                    rows={5}
                    placeholder="Ceritakan detail bug yang Anda temukan (contoh: Tombol X tidak bisa ditekan saat)..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 border-red-500/20 resize-none"
                    value={bugMessage}
                    onChange={(e) => setBugMessage(e.target.value)}
                  ></textarea>
                  <div className="text-right text-xs text-muted-foreground">
                    {bugMessage.length}/3000
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setIsBugOpen(false)} disabled={isSendingBug}>
                  Batal
                </Button>
                <Button type="submit" className="bg-red-600 text-white hover:bg-red-700" isLoading={isSendingBug}>
                  Kirim Laporan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <FeatureGuide
        title="Cara Lapor Bug"
        content={
          <ul className="list-disc pl-4 space-y-2">
            <li>Gunakan tombol <b>Lapor Bug</b> berwarna merah di bagian atas halaman ini untuk mengirimkan laporan error.</li>
            <li>Jelaskan secara rinci kendala yang kamu alami (contoh: tombol tidak bisa diklik di halaman tertentu, atau data tidak muncul).</li>
            <li>Laporanmu akan langsung dikirim ke tim pengembang untuk segera diperbaiki.</li>
          </ul>
        }
      />
    </div>
  );
}
