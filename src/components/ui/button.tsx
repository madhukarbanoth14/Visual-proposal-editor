"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary text-primary-foreground hover:opacity-90": variant === "primary",
            "bg-muted text-foreground hover:bg-border": variant === "secondary",
            "hover:bg-muted text-foreground": variant === "ghost",
            "border border-border bg-transparent hover:bg-muted": variant === "outline",
            "bg-danger text-white hover:opacity-90": variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-sm tracking-wide": size === "md",
            "px-8 py-3.5 text-base tracking-wide": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
