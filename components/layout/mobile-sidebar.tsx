"use client";

import { useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { Sidebar } from "./sidebar";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button onClick={() => setIsOpen(true)} className="p-2 text-foreground">
        <HiBars3 className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-4/5 max-w-[280px] bg-background h-full shadow-2xl animate-in slide-in-from-right duration-300 border-l border-border ml-auto">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-4 z-10 p-2 text-muted-foreground hover:text-foreground bg-background/50 rounded-full">
              <HiXMark className="h-6 w-6" />
            </button>
            <div className="h-full overflow-y-auto" onClick={(e) => {
              if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
                setIsOpen(false);
              }
            }}>
              <Sidebar className="w-full border-none px-4 flex md:flex" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
