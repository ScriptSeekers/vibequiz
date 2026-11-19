import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-purple-light text-primary-purple border border-primary-purple/20",
        purple:
          "bg-[#F3F0FE] text-[#7655E8] border border-[#7655E8]/20",
        blue:
          "bg-[#EEF3FE] text-[#477CF4] border border-[#477CF4]/20",
        pink:
          "bg-[#FDF0F5] text-[#F06C9B] border border-[#F06C9B]/20",
        orange:
          "bg-[#FFF6EE] text-[#FFAA55] border border-[#FFAA55]/30",
        green:
          "bg-[#EDFAF4] text-[#25B98A] border border-[#25B98A]/25",
        outline:
          "border border-slate-200 text-slate-700 bg-white",
        neutral:
          "bg-slate-100 text-slate-700 border border-slate-200/60",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px]",
        default: "px-3 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
