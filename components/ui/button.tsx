import * as React from "react";
import { cn } from "@/lib/utils";
import { HiOutlineArrowPath } from "react-icons/hi2";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", isLoading, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-[15px] font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-[#000000] shadow-sm hover:bg-accent":
              variant === "default",
            "border border-border bg-transparent text-foreground shadow-sm hover:bg-secondary":
              variant === "secondary",
            "border border-border bg-transparent shadow-sm hover:bg-secondary text-foreground":
              variant === "outline",
            "bg-transparent text-muted-foreground hover:text-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "px-[20px] py-[10px]": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-md px-8 text-base": size === "lg",
            "h-9 w-9 rounded-md": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading && <HiOutlineArrowPath className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
