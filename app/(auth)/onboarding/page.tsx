"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api-client";
import { HiOutlineComputerDesktop, HiOutlinePaintBrush, HiOutlinePresentationChartLine, HiOutlinePuzzlePiece } from "react-icons/hi2";
import { toast } from "sonner";

const FIELDS = [
  {
    id: "uiux",
    title: "UI/UX Design",
    icon: HiOutlineComputerDesktop,
  },
  {
    id: "graphicdesign",
    title: "Graphic Design",
    icon: HiOutlinePaintBrush,
  },
  {
    id: "digimark",
    title: "Digital Marketing",
    icon: HiOutlinePresentationChartLine,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSubmit = async () => {
    if (!selectedField) return;

    setIsLoading(true);

    try {
      await fetchApi("/auth/onboarding", {
        method: "POST",
        body: JSON.stringify({ field: selectedField }),
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses data");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Coming Soon Alert */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-background border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <HiOutlinePuzzlePiece className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Segera Hadir!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bidang ini sedang dalam pengembangan. Kami akan segera menghadirkannya untukmu. Stay tuned!
              </p>
              <Button
                className="w-full mt-2"
                onClick={() => setShowComingSoon(false)}
              >
                Oke, Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Pilih Bidang Karirmu</h1>
          <p className="text-muted-foreground">
            Pilih satu bidang fokus untuk mulai mendapatkan studi kasus dan simulasi yang relevan.
          </p>
        </div>

        {/* Field cards — square, icon on top */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {FIELDS.map((field) => {
            const Icon = field.icon;
            const isSelected = selectedField === field.id;

            return (
              <button
                key={field.id}
                onClick={() => setSelectedField(field.id)}
                className={`aspect-square flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md focus:outline-none ${isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 bg-card"
                  }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-foreground text-center leading-tight">{field.title}</span>
              </button>
            );
          })}

          {/* Coming Soon card */}
          <button
            onClick={() => setShowComingSoon(true)}
            className="aspect-square flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-4 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/40 focus:outline-none"
          >
            <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-secondary text-muted-foreground">
              <HiOutlinePuzzlePiece className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground text-center leading-tight">Bidang Lainnya</span>
          </button>
        </div>

        <Card className="border-border bg-secondary/30 shadow-none mb-8">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="text-2xl mt-0.5">⚠️</div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Perhatian</h4>
              <p className="text-sm text-muted-foreground">
                Kamu <strong>hanya bisa memilih satu bidang</strong> untuk akun ini dan pilihan ini <strong>tidak dapat diubah nanti</strong>. Pastikan kamu memilih bidang yang benar-benar ingin kamu latih.
              </p>
            </div>
          </CardContent>
        </Card>



        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            onClick={handleSubmit}
            disabled={!selectedField || isLoading}
            isLoading={isLoading}
          >
            Mulai Perjalanan
          </Button>
        </div>
      </div>
    </>
  );
}