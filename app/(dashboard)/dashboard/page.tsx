"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiSparkles, HiCheckCircle, HiBriefcase, HiArrowRight } from "react-icons/hi2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api-client";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeTasks: 0,
    completedTasks: 0,
    portfolioItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [tasks, portfolios] = await Promise.all([
          fetchApi("/tasks"),
          fetchApi("/portfolio"),
        ]);

        const active = tasks.data.filter((t: any) => t.status !== "done").length;
        const completed = tasks.data.filter((t: any) => t.status === "done").length;

        setStats({
          activeTasks: active,
          completedTasks: completed,
          portfolioItems: portfolios.data.length,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Pantau progress simulasi kerjamu hari ini.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brief Aktif</CardTitle>
            <HiSparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Brief sedang dikerjakan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Selesai</CardTitle>
            <HiCheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Siap dijadikan portofolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portofolio Publik</CardTitle>
            <HiBriefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : stats.portfolioItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Siap ditunjukkan ke rekruter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-black">Mulai Project Baru</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Generate brief realistis dari AI dan mulai simulasikan pengalaman kerjamu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/generate">
              <Button
                className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800"
              >
                Generate Brief <HiArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
