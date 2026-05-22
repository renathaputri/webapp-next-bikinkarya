"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, GripVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TaskStatus = "todo" | "inprogress" | "done";

export default function BoardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    // Optimistic update
    const prevTasks = [...tasks];
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error(error);
      setTasks(prevTasks); // Revert on failure
      alert("Failed to update task status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const columns: { id: TaskStatus; title: string; desc: string }[] = [
    { id: "todo", title: "To Do", desc: "Brief baru" },
    { id: "inprogress", title: "In Progress", desc: "Sedang dikerjakan" },
    { id: "done", title: "Done", desc: "Siap jadi portofolio" },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Kelola task dan simulasikan workflow kerjamu.
          </p>
        </div>
        <Link href="/generate">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Brief
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full gap-6 min-w-[800px]">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex-1 flex flex-col bg-secondary/30 rounded-xl border border-border/50 overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="p-4 border-b border-border/50 bg-secondary/50">
                <h3 className="font-semibold">{col.title}</h3>
                <p className="text-xs text-muted-foreground">{col.desc}</p>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {tasks.filter((t) => t.status === col.id).map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm"
                  >
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                      <div>
                        <Badge variant="outline" className="mb-2 text-[10px] uppercase">
                          {task.difficulty}
                        </Badge>
                        <CardTitle className="text-sm font-semibold line-clamp-2">
                          {task.brief?.title || "Untitled Project"}
                        </CardTitle>
                      </div>
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {task.brief?.client}
                      </p>
                      {col.id === "done" && !task.portfolio && (
                        <Link href={`/portfolio?upload=${task.id}`} className="mt-3 block">
                          <Button variant="secondary" size="sm" className="w-full text-xs h-7">
                            Upload to Portfolio
                          </Button>
                        </Link>
                      )}
                      {task.portfolio && (
                        <div className="mt-3 text-xs font-medium text-emerald-600 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                          In Portfolio
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {tasks.filter((t) => t.status === col.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                    Drop task here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
