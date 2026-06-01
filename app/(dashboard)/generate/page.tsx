"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, Loader2, Briefcase, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";

export default function GeneratePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [brief, setBrief] = useState<any>(null);
  const [field, setField] = useState("uiux");
  const [difficulty, setDifficulty] = useState("junior");

  useEffect(() => {
    fetchApi("/auth/me")
      .then((res) => {
        if (res.data?.field) setField(res.data.field);
      })
      .catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setBrief(null);
    try {
      const res = await fetchApi("/generate/brief", {
        method: "POST",
        body: JSON.stringify({ field, difficulty }),
      });
      setBrief(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Waduh, gagal generate brief nih 😵", {
        description: "Tenang, coba klik generate lagi ya. Kadang AI-nya lagi sibuk.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToBoard = async () => {
    if (!brief) return;
    setIsSaving(true);
    try {
      await fetchApi("/tasks", {
        method: "POST",
        body: JSON.stringify({ field, difficulty, brief }),
      });
      router.push("/board");
    } catch (error) {
      console.error(error);
      toast.error("Gagal simpan ke board 😢", {
        description: "Ada gangguan sementara. Coba lagi sebentar ya!",
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Case Generator</h1>
        <p className="text-muted-foreground mt-2">
          Dapatkan brief realistis layaknya dari client sungguhan untuk membangun portofoliomu.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="bg-primary/5 px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pengaturan Generate</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Sesuaikan tingkat kesulitan untuk brief yang di-generate</p>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-2.5">
              <Label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                Bidang <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
              </Label>
              <div className="flex h-11 w-full items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-sm text-muted-foreground cursor-not-allowed transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary/60" />
                <span className="font-medium capitalize">
                  {field === "uiux" ? "UI/UX Design" : 
                   field === "graphicdesign" ? "Graphic Design" : 
                   field === "digimark" ? "Digital Marketing" : field}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2.5">
              <Label className="text-sm font-semibold text-foreground/80">
                Tingkat Kesulitan
              </Label>
              <div className="relative">
                <select
                  className="flex h-11 w-full appearance-none rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer hover:bg-muted/20 hover:border-primary/30"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="junior">Junior (Arahan jelas, minim ambiguitas)</option>
                  <option value="mid">Mid (Sesuai workflow industri nyata)</option>
                  <option value="senior">Senior (Fokus ke strategi & problem-solving)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-8 h-12 text-base font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group" 
            size="lg" 
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5 group-hover:text-amber-200 transition-colors" />}
            {isGenerating ? "Menyusun Brief..." : "Generate Brief AI"}
          </Button>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card className="animate-pulse bg-muted/20 border-dashed">
          <CardContent className="h-64 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>AI sedang menyusun brief client...</p>
          </CardContent>
        </Card>
      )}

      {brief && !isGenerating && (
        <Card className="border-primary/20 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="border-b border-border bg-secondary/30">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Badge className="mb-2 uppercase" variant={difficulty === "junior" ? "default" : difficulty === "mid" ? "secondary" : "destructive"}>
                  {difficulty} Level
                </Badge>
                <CardTitle className="text-2xl">{brief.title}</CardTitle>
                <CardDescription className="text-base mt-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {brief.client}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Goal</h3>
              <p className="text-muted-foreground">{brief.goal}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Platform & Target User</h3>
                <p className="text-sm text-muted-foreground"><strong>Platform:</strong> {brief.platform}</p>
                <p className="text-sm text-muted-foreground mt-1"><strong>Target:</strong> {brief.targetUser}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Deadline</h3>
                <p className="text-sm font-medium text-destructive">{brief.deadline}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Expected Deliverables</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {brief.deliverables?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-sm mb-2 uppercase tracking-wider text-muted-foreground">Constraints & Arahan</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {brief.constraints?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
                <li className="mt-2 text-primary">{brief.expectedOutput}</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border pt-6 flex flex-col sm:flex-row gap-3">
            <Button className="w-full" size="lg" onClick={handleAddToBoard} isLoading={isSaving}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Kanban Board
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" size="lg" onClick={handleGenerate} disabled={isSaving}>
              Generate Ulang
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
