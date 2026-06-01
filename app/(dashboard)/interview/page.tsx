"use client";

import { useState, useEffect } from "react";
import { Sparkles, Play, SkipForward, HelpCircle, Loader2, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";

export default function InterviewPage() {
  const [field, setField] = useState("uiux");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionData, setQuestionData] = useState<any>(null);

  useEffect(() => {
    fetchApi("/auth/me")
      .then((res) => {
        if (res.data?.field) setField(res.data.field);
      })
      .catch(console.error);
  }, []);
  
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<any>(null);

  const generateQuestion = async () => {
    setIsGenerating(true);
    setQuestionData(null);
    setExplanation(null);
    try {
      const res = await fetchApi("/interview/question", {
        method: "POST",
        body: JSON.stringify({ field }),
      });
      setQuestionData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Ups, pertanyaan gagal dimuat 😵", {
        description: "AI rekruter-nya lagi istirahat. Coba lagi ya!",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getExplanation = async () => {
    if (!questionData) return;
    setIsExplaining(true);
    try {
      const res = await fetchApi("/interview/explain", {
        method: "POST",
        body: JSON.stringify({ field, question: questionData.question }),
      });
      setExplanation(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal nampilin penjelasan 😢", {
        description: "Tenang, klik lagi aja. Kita coba sekali lagi!",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulasi Interview</h1>
          <p className="text-muted-foreground mt-2">
            Latih kemampuanmu menjawab pertanyaan teknis dan behavioral dari HR/User.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => {
            setQuestionData(null);
            setExplanation(null);
          }} 
          title="Refresh Tampilan"
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {!questionData && !isGenerating && (
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 border-b border-border/50">
            <CardTitle className="text-lg">Mulai Sesi Latihan</CardTitle>
            <CardDescription className="text-xs mt-0.5">Pertanyaan teknis & behavioral acak layaknya interview sungguhan.</CardDescription>
          </div>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col space-y-2.5">
              <Label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                Bidang <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
              </Label>
              <div className="flex h-11 w-full items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-2 text-sm text-muted-foreground cursor-not-allowed transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary/60" />
                <span className="font-medium capitalize">
                  {field === "uiux" ? "UI/UX Design" : 
                   field === "graphicdesign" ? "Graphic Design" : 
                   field === "digimark" ? "Digital Marketing" : 
                   field === "frontend" ? "Frontend Development" : field}
                </span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group" 
              onClick={generateQuestion}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Mulai Interview
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card className="animate-pulse bg-muted/20 border-dashed">
          <CardContent className="h-48 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Rekruter sedang menyiapkan pertanyaan...</p>
          </CardContent>
        </Card>
      )}

      {questionData && (
        <Card className="border-primary/20 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-secondary/30 border-b border-border">
            <div className="flex justify-between items-center mb-2">
              <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                {questionData.category} Question
              </Badge>
              <Badge variant={questionData.difficulty === "Hard" ? "destructive" : questionData.difficulty === "Medium" ? "default" : "secondary"}>
                {questionData.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-2xl pt-2 leading-relaxed">
              "{questionData.question}"
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!explanation ? (
              <div className="py-8 text-center text-muted-foreground space-y-4">
                <p>Coba jawab pertanyaan ini secara lisan atau di dalam hati.</p>
                <p className="text-sm">Jika sudah selesai atau merasa kesulitan, klik tombol di bawah untuk melihat cara menjawab yang ideal.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-700 flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4" /> Cara Menjawab yang Ideal
                  </h3>
                  <p className="text-sm leading-relaxed">{explanation.idealAnswer}</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold text-sm mb-2 uppercase tracking-wider text-muted-foreground">Poin Kunci</h3>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      {explanation.keyPoints.map((pt: string, i: number) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20 text-destructive">
                    <h3 className="font-semibold text-sm mb-2 uppercase tracking-wider">Kesalahan Umum</h3>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      {explanation.commonMistakes.map((pt: string, i: number) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-secondary/10 border-t border-border pt-4 flex flex-col sm:flex-row gap-3 justify-between">
            {!explanation ? (
              <Button variant="secondary" onClick={getExplanation} isLoading={isExplaining}>
                <HelpCircle className="mr-2 h-4 w-4" /> Lihat Jawaban Ideal
              </Button>
            ) : (
              <div /> // Spacer
            )}
            <Button onClick={generateQuestion} disabled={isExplaining}>
              Pertanyaan Selanjutnya <SkipForward className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
