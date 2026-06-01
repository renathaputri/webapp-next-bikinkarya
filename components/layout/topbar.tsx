import { headers } from "next/headers";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";
import { HiBriefcase } from "react-icons/hi2";

export async function Topbar() {
  const headersList = await headers();
  const username = headersList.get("x-user-name") || "User";
  const field = headersList.get("x-user-field");

  return (
    <header className="h-[80px] flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-10 sticky top-0 z-10">
      {/* Left Side: Logo (Mobile) / Date (Desktop) */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2.5 font-extrabold text-[17px] text-foreground tracking-tight">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <HiBriefcase className="h-3.5 w-3.5 text-[#000000]" />
          </div>
          BikinKarya
        </div>

        {/* Desktop Date */}
        <span className="hidden md:inline-block text-sm font-medium text-muted-foreground">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Right Side: Profile / Theme Toggle / Hamburger */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Profile */}
        <div className="flex md:hidden items-center gap-2 mr-1">
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-semibold text-foreground leading-tight">{username}</span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {field === "uiux" ? "UI/UX Design" : field === "graphicdesign" ? "Graphic Design" : field === "digimark" ? "Digital Marketing" : field}
            </span>
          </div>
          <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center font-bold text-[14px] text-[#000000]">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-foreground">{username}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {field === "uiux" ? "UI/UX Design" : field === "graphicdesign" ? "Graphic Design" : field === "digimark" ? "Digital Marketing" : field}
            </span>
          </div>
          <div className="h-11 w-11 rounded-md bg-primary flex items-center justify-center font-bold text-[15px] text-[#000000]">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <ThemeToggle className="h-9 w-9 md:h-11 md:w-11 relative rounded-md border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" />
          <MobileSidebar />
        </div>
      </div>
    </header>
  );
}
