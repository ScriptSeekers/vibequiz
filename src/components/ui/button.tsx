"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary-purple text-white shadow-sm hover:bg-primary-purple-hover shadow-primary-purple/20",
        gradient:
          "bg-gradient-to-r from-primary-purple to-vibe-blue text-white shadow-md shadow-primary-purple/25 hover:shadow-lg hover:shadow-primary-purple/35 hover:brightness-105",
        pinkGradient:
          "bg-gradient-to-r from-vibe-pink to-primary-purple text-white shadow-md shadow-vibe-pink/25 hover:shadow-lg hover:brightness-105",
        secondary:
          "bg-vibe-blue-light text-vibe-blue hover:bg-vibe-blue/15 hover:text-vibe-blue-hover",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
        subtle:
          "bg-primary-purple-light text-primary-purple hover:bg-primary-purple-subtle/80",
        ghost:
          "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20",
        link:
          "text-primary-purple underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5 min-h-[44px]", // Minimum 44px for touch targets
        sm: "h-9 rounded-lg px-3 text-xs min-h-[36px]",
        lg: "h-13 rounded-2xl px-8 text-base font-bold min-h-[52px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl",
        iconSm: "h-9 w-9 min-h-[36px] min-w-[36px] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
