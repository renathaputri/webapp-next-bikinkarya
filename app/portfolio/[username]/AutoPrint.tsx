"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AutoPrint() {
  const searchParams = useSearchParams();
  const print = searchParams.get("print");

  useEffect(() => {
    if (print === "true") {
      // Delay slightly to ensure images load
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [print]);

  return null;
}
