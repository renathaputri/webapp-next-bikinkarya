import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HiBriefcase } from "react-icons/hi2";

export default function LoadingPortfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center animate-pulse">
              <HiBriefcase className="h-3 w-3 text-primary/50" />
            </div>
            <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="h-8 w-32 bg-muted animate-pulse rounded-md"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md bg-muted animate-pulse mb-6"></div>
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-2"></div>
          <div className="h-6 w-48 bg-muted animate-pulse rounded-md mb-6"></div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
            <div className="h-6 w-24 bg-muted animate-pulse rounded-full"></div>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50">
                <div className="aspect-video w-full bg-muted animate-pulse"></div>
                <CardHeader className="p-4 sm:p-6 pb-2">
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full"></div>
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md mt-1"></div>
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md mt-2"></div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-2 pb-4 sm:pb-6">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md"></div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0">
                  <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
