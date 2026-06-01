"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi, fetchApiUpload } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HiOutlineArrowPath, HiArrowUpTray, HiArrowTopRightOnSquare, HiGlobeAlt, HiLockClosed, HiShare, HiBriefcase, HiXMark, HiExclamationTriangle, HiTrash } from "react-icons/hi2";
import Link from "next/link";
import { FeatureGuide } from "@/components/ui/feature-guide";

function PortfolioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uploadTaskId = searchParams.get("upload");

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState<any>(null);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(!!uploadTaskId);
  const [selectedTaskId, setSelectedTaskId] = useState(uploadTaskId || "");
  const [workLink, setWorkLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portRes, tasksRes, meRes] = await Promise.all([
        fetchApi("/portfolio"),
        fetchApi("/tasks?status=done"),
        fetchApi("/auth/me").catch(() => null),
      ]);
      setPortfolios(portRes.data);
      if (meRes?.data?.username) {
        setUsername(meRes.data.username);
      }
      if (meRes?.data) {
        setUserEmail(meRes.data.email ?? null);
      }
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
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Kegedean filenya ngab, maksimal 5MB ya.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !file || !workLink) {
      toast.error("Isi semua kolomnya dulu ya biar rapi.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kegedean filenya ngab, maksimal 5MB ya.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetchApiUpload("/upload/thumbnail", formData);
      const thumbnailUrl = uploadRes.data.url;

      await fetchApi("/portfolio", {
        method: "POST",
        body: JSON.stringify({
          taskId: selectedTaskId,
          thumbnail: thumbnailUrl,
          workLink,
          isPublic: true,
        }),
      });

      setIsModalOpen(false);
      setFile(null);
      setWorkLink("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.replace("/portfolio");
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal upload nih. Coba lagi ya.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleVisibility = async (id: string, currentPublic: boolean) => {
    try {
      setPortfolios(portfolios.map(p => p.id === id ? { ...p, isPublic: !currentPublic } : p));
      await fetchApi(`/portfolio/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublic: !currentPublic }),
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal update status nih. Coba refresh.");
      setPortfolios(portfolios.map(p => p.id === id ? { ...p, isPublic: currentPublic } : p));
    }
  };

  const handleDelete = async () => {
    if (!portfolioToDelete) return;
    setIsDeleting(true);
    try {
      await fetchApi(`/portfolio/${portfolioToDelete}`, {
        method: "DELETE",
      });
      setPortfolios(portfolios.filter(p => p.id !== portfolioToDelete));
      setTasks([...tasks, portfolios.find(p => p.id === portfolioToDelete)?.task].filter(Boolean));
      toast.success("Sip, portofolio udah dihapus.");
      setIsDeleteModalOpen(false);
      setPortfolioToDelete(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal hapus portofolio. Coba lagi bentar ya.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <HiOutlineArrowPath className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Email Warning */}
      {!userEmail && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
          <HiExclamationTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Info kontak belum diisi</p>
            <p className="text-muted-foreground mt-0.5">
              Kamu belum menambahkan email kontak. Pengunjung portofolio publikmu tidak akan bisa menghubungimu.
              <Link href="/profile" className="text-primary ml-1 underline underline-offset-2 hover:text-primary/80">Isi di halaman Profil →</Link>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portofolio</h1>
          <p className="text-muted-foreground mt-1">
            Kumpulan hasil simulasi kerjamu yang siap ditunjukkan ke rekruter.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsModalOpen(true)}>
            <HiArrowUpTray className="mr-2 h-4 w-4" /> Upload Baru
          </Button>
          {username && portfolios.length > 0 && (
            <Button variant="outline" onClick={() => {
              setIsPublicModalOpen(true);
              navigator.clipboard.writeText(`${window.location.origin}/portfolio/${username}`);
              toast.success("Link publik udah di-copy otomatis!");
            }}>
              <HiGlobeAlt className="mr-2 h-4 w-4" /> Buat Publik
            </Button>
          )}
        </div>
      </div>

      {portfolios.length === 0 ? (
        <Card className="bg-muted/10 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center mb-4">
              <HiBriefcase className="h-6 w-6 text-foreground" />
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
            <Card
              key={item.id}
              className="overflow-hidden flex flex-col group cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedBrief({ ...item.task.brief, difficulty: item.task.difficulty, field: item.task.field })}
            >
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.task.brief?.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.isPublic ? "secondary" : "outline"} className="bg-background/80 backdrop-blur-md">
                    {item.isPublic ? <HiGlobeAlt className="w-3 h-3 mr-1" /> : <HiLockClosed className="w-3 h-3 mr-1" />}
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
              <CardFooter className="p-4 pt-0 flex gap-2" onClick={(e) => e.stopPropagation()}>
                <a href={item.workLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="secondary" className="w-full h-8 text-xs pointer-events-auto">
                    <HiArrowTopRightOnSquare className="mr-1.5 h-3 w-3" /> Lihat Hasil
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 pointer-events-auto"
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(item.id, item.isPublic); }}
                  title={item.isPublic ? "Jadikan Privat" : "Jadikan Publik"}
                >
                  {item.isPublic ? <HiLockClosed className="h-3 w-3" /> : <HiGlobeAlt className="h-3 w-3" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 pointer-events-auto bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPortfolioToDelete(item.id);
                    setIsDeleteModalOpen(true);
                  }}
                  title="Hapus Portofolio"
                >
                  <HiTrash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border-border">
            <CardHeader>
              <CardTitle>Upload ke Portofolio</CardTitle>
              <CardDescription>
                Pilih task yang sudah selesai dan lampirkan hasil kerjamu.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUploadSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task">Pilih Task (Selesai)</Label>
                  <div className="relative group">
                    <select
                      id="task"
                      required
                      className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                    >
                      <option value="" disabled className="text-muted-foreground">-- Pilih Task untuk Portofolio --</option>
                      {tasks.map(t => (
                        <option key={t.id} value={t.id} className="bg-card text-foreground py-2">
                          {t.brief?.title} ({t.difficulty})
                        </option>
                      ))}
                      {tasks.length === 0 && !uploadTaskId && (
                        <option value="" disabled>Tidak ada task selesai yang tersedia</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary/50 group-hover:bg-secondary transition-colors">
                        <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
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
                    className="cursor-pointer file:text-primary file:font-medium hover:file:text-primary/80"
                  />
                  <p className="text-xs text-muted-foreground">Format gambar (JPG, PNG). Maksimal ukuran file 5MB.</p>
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
              <CardFooter className="flex justify-end gap-3 pt-4 border-t border-border">
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

      {/* Brief Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setSelectedBrief(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <HiXMark className="w-5 h-5" />
            </button>
            <div className="border-b border-border bg-muted/20 p-6 pr-12">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="uppercase">{selectedBrief.difficulty} Level</Badge>
                <Badge variant="outline" className="text-muted-foreground">{selectedBrief.field}</Badge>
              </div>
              <h2 className="text-xl font-bold leading-snug">{selectedBrief.title}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <HiBriefcase className="h-4 w-4 shrink-0" />
                {selectedBrief.client}
              </div>
            </div>

            <div className="p-6 space-y-5 text-sm flex-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Goal</p>
                <p className="text-foreground leading-relaxed">{selectedBrief.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/20 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Platform</p>
                  <p>{selectedBrief.platform}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Target User</p>
                  <p>{selectedBrief.targetUser}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Deadline</p>
                  <p className="font-medium">{selectedBrief.deadline}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Expected Deliverables</p>
                <ul className="space-y-1.5 pl-4">
                  {selectedBrief.deliverables?.map((item: string, i: number) => (
                    <li key={i} className="list-disc text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Constraints & Arahan</p>
                <ul className="space-y-1.5 pl-4">
                  {selectedBrief.constraints?.map((item: string, i: number) => (
                    <li key={i} className="list-disc text-foreground">{item}</li>
                  ))}
                  {selectedBrief.expectedOutput && (
                    <li className="list-disc font-semibold mt-2">{selectedBrief.expectedOutput}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-border p-4 flex justify-end bg-muted/10">
              <Button onClick={() => setSelectedBrief(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* Public Preview Modal */}
      {isPublicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-card rounded-xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-200 relative overflow-hidden h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-bold">Public Portfolio Preview</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/portfolio/${username}`);
                  toast.success("Link udah di-copy!");
                }}>
                  <HiShare className="w-4 h-4 mr-2" /> Copy Link
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsPublicModalOpen(false)}>
                  <HiXMark className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 bg-muted/10 p-4 overflow-hidden relative">
              <div className="absolute inset-4 rounded-xl border border-border/50 bg-background shadow-sm overflow-hidden">
                <iframe src={`/portfolio/${username}`} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 border-border">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <HiTrash className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Hapus Portofolio?</CardTitle>
              <CardDescription>
                Tindakan ini tidak dapat dibatalkan. Portofolio ini akan dihapus secara permanen.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPortfolioToDelete(null);
                }}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white hover:border-destructive"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Hapus
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <FeatureGuide
        title="Cara Pakai Portofolio"
        content={
          <ul className="list-disc pl-4 space-y-2">
            <li>Klik <b>Upload Baru</b> untuk mengunggah hasil kerja dari task yang sudah selesai di Kanban Board.</li>
            <li>Kamu bisa mengatur visibilitas portofolio menjadi <b>Publik</b> atau <b>Privat</b> dengan mengklik tombol kunci/globe di setiap kartu.</li>
            <li>Gunakan <b>Buat Publik</b> untuk melihat preview dan membagikan link portofolio publikmu.</li>
            <li>Pastikan email kontak sudah diisi di halaman <b>Profil</b> agar pengunjung bisa menghubungimu.</li>
          </ul>
        }
      />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <HiOutlineArrowPath className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}