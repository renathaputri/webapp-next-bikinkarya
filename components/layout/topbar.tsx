import { headers } from "next/headers";

export async function Topbar() {
  const headersList = await headers();
  const username = headersList.get("x-user-name") || "User";
  const field = headersList.get("x-user-field");

  return (
    <header className="h-16 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-8 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold">{username}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {field === "uiux" ? "UI/UX Design" : field === "graphicdesign" ? "Graphic Design" : field === "digimark" ? "Digital Marketing" : field}
          </span>
        </div>
        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-bold text-sm border border-border">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
