"use client";

import { useState } from "react";
import { Sparkles, Play, SkipForward, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api-client";

export default function InterviewPage() {
  const [field, setField] = useState("uiux");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionData, setQuestionData] = useState<any>(null);
  
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
      alert("Gagal memuat pertanyaan.");
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
      alert("Gagal memuat penjelasan.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulasi Interview</h1>
        <p className="text-muted-foreground mt-2">
          Latih kemampuanmu menjawab pertanyaan teknis dan behavioral dari HR/User.
        </p>
      </div>

      {!questionData && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Mulai Sesi Latihan</CardTitle>
            <CardDescription>Pilih bidang yang ingin dilatih dan AI akan memberikan pertanyaan acak layaknya interview sungguhan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <option value="frontend">Frontend Development</option>
              </select>
            </div>
            <Button size="lg" className="w-full mt-4" onClick={generateQuestion}>
              <Play className="mr-2 h-4 w-4" /> Mulai Interview
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
                  <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20 text-destructive-foreground">
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
