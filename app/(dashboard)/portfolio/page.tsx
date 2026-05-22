"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi, fetchApiUpload } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, ExternalLink, Globe, Lock, Share2, Briefcase } from "lucide-react";

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uploadTaskId = searchParams.get("upload");

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(!!uploadTaskId);
  const [selectedTaskId, setSelectedTaskId] = useState(uploadTaskId || "");
  const [workLink, setWorkLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portRes, tasksRes] = await Promise.all([
        fetchApi("/portfolio"),
        fetchApi("/tasks?status=done"),
      ]);
      setPortfolios(portRes.data);
      // Only show tasks that don't already have a portfolio item
      const availableTasks = tasksRes.data.filter((t: any) => !t.portfolio);
      setTasks(availableTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !file || !workLink) {
      alert("Semua field harus diisi");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetchApiUpload("/upload/thumbnail", formData);
      const thumbnailUrl = uploadRes.data.url;

      // 2. Create portfolio entry
      await fetchApi("/portfolio", {
        method: "POST",
        body: JSON.stringify({
          taskId: selectedTaskId,
          thumbnail: thumbnailUrl,
          workLink,
          isPublic: true,
        }),
      });

      // Reset and reload
      setIsModalOpen(false);
      setFile(null);
      setWorkLink("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.replace("/portfolio");
      loadData();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleVisibility = async (id: string, currentPublic: boolean) => {
    try {
      // Optimistic update
      setPortfolios(portfolios.map(p => p.id === id ? { ...p, isPublic: !currentPublic } : p));
      await fetchApi(`/portfolio/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublic: !currentPublic }),
      });
    } catch (error) {
      console.error(error);
      alert("Gagal update status");
      // Revert on error
      setPortfolios(portfolios.map(p => p.id === id ? { ...p, isPublic: currentPublic } : p));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portofolio</h1>
          <p className="text-muted-foreground mt-1">
            Kumpulan hasil simulasi kerjamu yang siap ditunjukkan ke rekruter.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Baru
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card className="bg-muted/10 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Belum ada portofolio</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mb-6">
              Selesaikan task di Kanban Board dan upload hasilnya ke sini untuk membangun portofoliomu.
            </p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline">
              Upload Hasil Kerja Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col group">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.task.brief?.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.isPublic ? "secondary" : "outline"} className="bg-background/80 backdrop-blur-md">
                    {item.isPublic ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    {item.isPublic ? "Publik" : "Privat"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base line-clamp-1">{item.task.brief?.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-1">{item.task.brief?.client}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px]">{item.task.field}</Badge>
                  <Badge variant="outline" className="text-[10px]">{item.task.difficulty}</Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <a href={item.workLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="secondary" className="w-full h-8 text-xs">
                    <ExternalLink className="mr-1.5 h-3 w-3" /> Lihat Hasil
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => toggleVisibility(item.id, item.isPublic)}
                  title={item.isPublic ? "Jadikan Privat" : "Jadikan Publik"}
                >
                  {item.isPublic ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Upload ke Portofolio</CardTitle>
              <CardDescription>
                Pilih task yang sudah selesai dan lampirkan hasil kerjamu.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUploadSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task">Pilih Task (Done)</Label>
                  <select
                    id="task"
                    required
                    className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                  >
                    <option value="" disabled>-- Pilih Project --</option>
                    {tasks.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.brief?.title} ({t.difficulty})
                      </option>
                    ))}
                    {tasks.length === 0 && !uploadTaskId && (
                      <option value="" disabled>Tidak ada task selesai yang tersedia</option>
                    )}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail (Gambar)</Label>
                  <Input 
                    id="thumbnail" 
                    type="file" 
                    accept="image/*" 
                    required 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workLink">Link Hasil Kerja</Label>
                  <Input 
                    id="workLink" 
                    type="url" 
                    placeholder="https://figma.com/... atau https://drive.google.com/..." 
                    required 
                    value={workLink}
                    onChange={(e) => setWorkLink(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Link Figma, Behance, Google Drive, dsb.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isUploading}>
                  Batal
                </Button>
                <Button type="submit" isLoading={isUploading}>
                  Upload & Publikasikan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
