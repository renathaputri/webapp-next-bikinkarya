"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchApi } from "@/lib/api-client";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const field = formData.get("field") as string;

    try {
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, field }),
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal mendaftar");
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass border-none shadow-xl">
      <CardHeader className="space-y-3 items-center text-center pb-6">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-2">
          <Briefcase className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Mulai BikinKarya</CardTitle>
        <CardDescription className="text-base">
          Buat akun dan bangun portofolio pertamamu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" placeholder="Pilih username unik" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Bidang Fokus</Label>
            <select
              id="field"
              name="field"
              className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              required
            >
              <option value="" disabled selected>Pilih bidang yang diminati</option>
              <option value="uiux">UI/UX Design</option>
              <option value="graphicdesign">Graphic Design</option>
              <option value="digimark">Digital Marketing</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Minimal 6 karakter" required minLength={6} />
          </div>
          

          
          <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
            Daftar
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 pt-6">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
