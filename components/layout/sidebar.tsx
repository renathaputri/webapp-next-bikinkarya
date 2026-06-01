"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HiViewColumns, HiSparkles, HiSquares2X2, HiBriefcase, HiChatBubbleLeftEllipsis, HiUser, HiArrowRightOnRectangle, HiMegaphone } from "react-icons/hi2";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: HiViewColumns },
  { title: "Generate Brief", href: "/generate", icon: HiSparkles },
  { title: "Kanban Board", href: "/board", icon: HiSquares2X2 },
  { title: "Portfolio", href: "/portfolio", icon: HiBriefcase },
  { title: "Interview", href: "/interview", icon: HiChatBubbleLeftEllipsis },
  { title: "Updates", href: "/updates", icon: HiMegaphone },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full border-r border-border/50 bg-background w-[280px] px-6 py-8", className)}>
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
          <HiBriefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-extrabold text-2xl tracking-tight text-foreground">BikinKarya</span>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
              pathname === item.href
                ? "bg-transparent text-primary font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="mt-auto space-y-1 pt-6 border-t border-border/50">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
            pathname === "/profile"
              ? "bg-transparent text-primary font-semibold"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <HiUser className="h-4 w-4" />
          Profile
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left"
        >
          <HiArrowRightOnRectangle className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}