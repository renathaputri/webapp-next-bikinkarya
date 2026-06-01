"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HiOutlineArrowPath, HiPlus, HiXMark, HiArchiveBox, HiTrash, HiBriefcase, HiArchiveBoxXMark, HiExclamationTriangle } from "react-icons/hi2";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureGuide } from "@/components/ui/feature-guide";

type TaskStatus = "todo" | "inprogress" | "done" | "archived";

type ConfirmDialog = {
  taskId: string;
  title: string;
  description: string;
  confirmLabel: string;
  action: () => void;
} | null;

export default function BoardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchApi("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const prevTasks = [...tasks];
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));

    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error(error);
      setTasks(prevTasks);
      toast.error("Gagal ubah status task. Coba lagi bentar ya.");
    }
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    await updateTaskStatus(taskId, newStatus);
  };

  const handleArchive = async (taskId: string) => {
    const prevTasks = [...tasks];
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "archived" } : t)));
    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "archived" }),
      });
      toast.success("Aman! Task udah masuk arsip.");
    } catch (error) {
      console.error(error);
      setTasks(prevTasks);
      toast.error("Gagal masukin arsip. Coba lagi ya.");
    }
  };

  const handleUnarchive = async (taskId: string) => {
    const prevTasks = [...tasks];
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "todo" } : t)));
    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "todo" }),
      });
      toast.success("Task udah balik ke To Do.");
    } catch (error) {
      console.error(error);
      setTasks(prevTasks);
      toast.error("Gagal balikin task. Coba lagi ya.");
    }
  };

  const handleDelete = async (taskId: string) => {
    const prevTasks = [...tasks];
    setTasks(tasks.filter((t) => t.id !== taskId));
    try {
      await fetchApi(`/tasks/${taskId}`, { method: "DELETE" });
      toast.success("Task udah dihapus permanen. Bye!");
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
      toast.error("Gagal hapus task. Coba lagi ya.");
    }
  };

  const confirmDelete = (taskId: string, title: string) => {
    setConfirmDialog({
      taskId,
      title: "Hapus Task?",
      description: `"${title || "Task ini"}" akan dihapus permanen dan tidak bisa dikembalikan.`,
      confirmLabel: "Hapus",
      action: () => {
        setConfirmDialog(null);
        handleDelete(taskId);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <HiOutlineArrowPath className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const columns: { id: TaskStatus; title: string; desc: string }[] = [
    { id: "todo", title: "To Do", desc: "Brief baru" },
    { id: "inprogress", title: "In Progress", desc: "Sedang dikerjakan" },
    { id: "done", title: "Done", desc: "Siap jadi portofolio" },
  ];

  const activeTasks = tasks.filter((t) => t.status !== "archived");
  const archivedTasks = tasks.filter((t) => t.status === "archived");

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Kelola task dan simulasikan workflow kerjamu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowArchived(!showArchived)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <HiArchiveBox className="h-4 w-4" />
            Arsip
            {archivedTasks.length > 0 && (
              <span className="ml-1 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                {archivedTasks.length}
              </span>
            )}
          </Button>
          <Link href="/generate">
            <Button>
              <HiPlus className="mr-2 h-4 w-4" /> New Brief
            </Button>
          </Link>
        </div>
      </div>

      {/* Archived panel */}
      {showArchived && (
        <div className="mb-6 rounded-xl border border-border/50 bg-secondary/20 p-4">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-widest">
            Arsip ({archivedTasks.length})
          </h3>
          {archivedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada task yang diarsipkan.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {archivedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 bg-background border border-border/50 rounded-lg px-3 py-2 text-sm shadow-sm"
                >
                  <span className="font-medium line-clamp-1 max-w-[200px] text-foreground">
                    {task.brief?.title || "Untitled"}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase shrink-0 border-primary/20 text-primary">
                    {task.difficulty}
                  </Badge>
                  <button
                    onClick={() => handleUnarchive(task.id)}
                    className="text-muted-foreground hover:text-primary transition-colors ml-1"
                    title="Kembalikan ke To Do"
                  >
                    <HiArchiveBoxXMark className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirmDelete(task.id, task.brief?.title)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Hapus permanen"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full gap-6 min-w-[800px]">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex-1 flex flex-col bg-muted/30 dark:bg-secondary/30 rounded-xl border border-border overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="p-4 border-b border-border bg-muted/50 dark:bg-secondary/50 shrink-0">
                <h3 className="font-semibold text-foreground">{col.title}</h3>
                <p className="text-xs text-muted-foreground">{col.desc}</p>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {activeTasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedTask(task)}
                      className="cursor-grab active:cursor-grabbing border border-border/60 shadow-sm hover:shadow-md hover:border-primary/50 bg-background dark:bg-card transition-all select-none group"
                    >
                      <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between space-y-0">
                        <div className="flex-1 min-w-0 pr-1">
                          <Badge
                            variant="outline"
                            className="mb-2 text-[10px] uppercase bg-primary/5 border-primary/20 text-primary dark:bg-transparent"
                          >
                            {task.difficulty}
                          </Badge>
                          <CardTitle className="text-sm font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                            {task.brief?.title || "Untitled Project"}
                          </CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent className="p-3 pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {task.brief?.client}
                        </p>
                        {col.id === "done" && !task.portfolio && (
                          <Link
                            href={`/portfolio?upload=${task.id}`}
                            className="mt-3 block"
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full text-xs h-7 pointer-events-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Upload to Portfolio
                            </Button>
                          </Link>
                        )}
                        {task.portfolio && (
                          <div className="mt-3 text-xs font-medium flex items-center text-foreground">
                            <span className="w-2 h-2 rounded-[2px] bg-primary mr-2" />
                            In Portfolio
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                {activeTasks.filter((t) => t.status === col.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border/60 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                    Drop task here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTask(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] bg-card rounded-xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-200 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border/50 bg-muted/20 p-6 pr-12 shrink-0 relative">
              <button 
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="uppercase border-primary/20 text-primary">{selectedTask.difficulty} Level</Badge>
                <Badge variant="outline" className="text-muted-foreground">{selectedTask.field}</Badge>
              </div>
              <h2 className="text-xl font-bold leading-snug text-foreground">{selectedTask.brief?.title}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <HiBriefcase className="h-4 w-4 shrink-0" />
                {selectedTask.brief?.client}
              </div>
            </div>

            <div className="p-6 space-y-5 text-sm flex-1 overflow-y-auto">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Goal</p>
                <p className="text-foreground leading-relaxed">{selectedTask.brief?.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/20 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Platform</p>
                  <p className="text-foreground">{selectedTask.brief?.platform}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Target User</p>
                  <p className="text-foreground">{selectedTask.brief?.targetUser}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Deadline</p>
                  <p className="font-medium text-foreground">{selectedTask.brief?.deadline}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Expected Deliverables</p>
                <ul className="space-y-1.5 pl-4">
                  {selectedTask.brief?.deliverables?.map((item: string, i: number) => (
                    <li key={i} className="list-disc text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Constraints & Arahan</p>
                <ul className="space-y-1.5 pl-4">
                  {selectedTask.brief?.constraints?.map((item: string, i: number) => (
                    <li key={i} className="list-disc text-foreground">{item}</li>
                  ))}
                  {selectedTask.brief?.expectedOutput && (
                    <li className="list-disc font-semibold mt-2 text-foreground">{selectedTask.brief?.expectedOutput}</li>
                  )}
                </ul>
              </div>

              {/* Mobile Friendly Status Toggle */}
              <div className="rounded-lg border border-border bg-muted/20 p-4 mt-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Ubah Status Task</p>
                <div className="flex flex-wrap gap-2">
                  {columns.map((col) => (
                    <Button
                      key={col.id}
                      variant={selectedTask.status === col.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, col.id);
                        setSelectedTask({ ...selectedTask, status: col.id });
                      }}
                      className="flex-1 min-w-[100px]"
                    >
                      {col.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-border/50 p-4 flex justify-between bg-muted/10 items-center shrink-0">
              <Button 
                variant="outline" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => { 
                  const taskId = selectedTask.id;
                  setSelectedTask(null); 
                  handleArchive(taskId); 
                }}
              >
                <HiArchiveBox className="mr-2 h-4 w-4" /> Arsipkan Task
              </Button>
              <Button 
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => { 
                  const taskId = selectedTask.id;
                  const title = selectedTask.brief?.title;
                  setSelectedTask(null);
                  confirmDelete(taskId, title); 
                }}
              >
                <HiTrash className="mr-2 h-4 w-4" /> Hapus Permanen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FIX 1: Confirm dialog via portal */}
      {confirmDialog && createPortal(
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-popover rounded-xl shadow-2xl border border-border p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <HiExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{confirmDialog.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {confirmDialog.description}
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialog(null)}
              >
                Batal
              </Button>
              <button
                onClick={confirmDialog.action}
                className="inline-flex items-center justify-center rounded-md text-sm font-semibold px-4 h-8 bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <FeatureGuide
        title="Cara Pakai Kanban Board"
        content={
          <ul className="list-disc pl-4 space-y-2">
            <li>Tarik (drag) dan lepas (drop) task ke kolom yang sesuai (To Do, In Progress, Done).</li>
            <li>Klik <b>New Brief</b> untuk membuat task baru dari generator.</li>
            <li>Klik tulisan di task card untuk membuka modal dan melihat detail brief. Kamu juga bisa <b>Arsipkan</b> atau <b>Hapus</b> task dari modal tersebut.</li>
            <li>Setelah task berada di kolom Done, klik <b>Upload to Portfolio</b> untuk menambahkannya ke profil publikmu.</li>
          </ul>
        }
      />
    </div>
  );
}