import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HiArrowTopRightOnSquare, HiBriefcase, HiEnvelope } from "react-icons/hi2";
import Link from "next/link";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  
  // Fetch user and public portfolio items directly via Prisma since this is a Server Component
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      email: true,
      field: true,
      portfolios: {
        where: { isPublic: true },
        include: { task: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Premium minimal header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <HiBriefcase className="h-3 w-3 text-primary-foreground" />
            </div>
            BikinKarya
          </div>
          <Link href="/register">
            <Button variant="outline" size="sm">Buat Portofoliomu</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md bg-secondary flex items-center justify-center font-bold text-2xl sm:text-3xl border border-border shadow-sm mb-6">
            {username.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Hi, I&apos;m <span className="text-primary">{user.username}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 capitalize">
            {user.field === "uiux" ? "UI/UX Designer" : user.field === "graphicdesign" ? "Graphic Designer" : user.field === "digimark" ? "Digital Marketer" : user.field}
          </p>
          {user.email && (
            <div className="flex gap-4 justify-center">
              <a href={`mailto:${user.email}`}>
                <Button className="rounded-md px-8 text-primary-foreground">
                  <HiEnvelope className="mr-2 h-4 w-4" /> Contact Me
                </Button>
              </a>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Featured Projects</h2>
            <Badge variant="secondary">{user.portfolios.length} Projects</Badge>
          </div>

          {user.portfolios.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border rounded-xl bg-secondary/20">
              <p className="text-muted-foreground">Belum ada project publik.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {user.portfolios.map((item: any, idx: number) => (
                <Card key={item.id} className={`overflow-hidden group border-border/50 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-8`} style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    <img 
                      src={item.thumbnail} 
                      alt={(item.task.brief as any)?.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4 sm:p-6 pb-2">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="text-[10px]">{item.task.field}</Badge>
                      <Badge variant="outline" className="text-[10px]">{item.task.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">
                      {item.task.brief ? (item.task.brief as any).title : "Untitled"}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Client: {item.task.brief ? (item.task.brief as any).client : "Unknown"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-2 pb-4 sm:pb-6">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.task.brief ? (item.task.brief as any).goal : ""}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 sm:p-6 pt-0">
                    <a href={item.workLink} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full" variant="outline">
                        View Project Details <HiArrowTopRightOnSquare className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BikinKarya. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
