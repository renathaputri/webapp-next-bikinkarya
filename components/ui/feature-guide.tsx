"use client";

import { useState, useEffect } from "react";
import { HiOutlineQuestionMarkCircle, HiXMark } from "react-icons/hi2";

interface FeatureGuideProps {
  title: string;
  content: React.ReactNode;
}

export function FeatureGuide({ title, content }: FeatureGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip initially after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 1500);
    const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Help Card */}
      <div
        className={`absolute bottom-16 right-0 w-[calc(100vw-3rem)] sm:w-80 bg-card rounded-2xl shadow-xl border border-border overflow-hidden transition-all duration-300 origin-bottom-right
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
          <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
            <HiOutlineQuestionMarkCircle className="w-5 h-5 text-primary" />
            {title}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 text-[13px] text-muted-foreground space-y-3 leading-relaxed">
          {content}
        </div>
      </div>

      {/* Tooltip */}
      <div
        className={`absolute right-16 bottom-2 whitespace-nowrap bg-foreground text-background text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none transition-all duration-300
          ${showTooltip && !isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
      >
        Klik di sini buat liat contekan cara pakainya!
        {/* Triangle pointer */}
        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-foreground"></div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Petunjuk Fitur"
      >
        {isOpen ? (
          <HiXMark className="w-6 h-6" />
        ) : (
          <HiOutlineQuestionMarkCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
