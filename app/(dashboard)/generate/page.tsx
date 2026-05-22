"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/api-client";

export default function GeneratePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [brief, setBrief] = useState<any>(null);
  const [field, setField] = useState("uiux");
  const [difficulty, setDifficulty] = useState("junior");

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
      alert("Failed to generate brief. Please try again.");
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
      alert("Failed to save task to board.");
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

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bidang</Label>
              <select
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                value={field}
                onChange={(e) => setField(e.target.value)}
              >
                <option value="uiux">UI/UX Design</option>
                <option value="graphicdesign">Graphic Design</option>
                <option value="digimark">Digital Marketing</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tingkat Kesulitan</Label>
              <select
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="junior">Junior (Clear brief, low ambiguity)</option>
                <option value="mid">Mid (Realistic workflow, constraints)</option>
                <option value="senior">Senior (High ambiguity, strategic)</option>
              </select>
            </div>
          </div>
          <Button 
            className="w-full mt-6" 
            size="lg" 
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Brief AI
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
