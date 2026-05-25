import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium",
    "transition-[transform,box-shadow,background-color,opacity] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF87] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]", // Emil: buttons must feel responsive
  ],
  {
    variants: {
      variant: {
        default:
          "bg-[#00FF87] text-black font-semibold hover:bg-[#00E077] hover:shadow-[0_0_20px_rgba(0,255,135,0.35)]",
        destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
        outline:
          "border border-[#2A2A2A] bg-transparent text-white hover:bg-[#1A1A1A] hover:border-[#3A3A3A]",
        secondary: "bg-[#1A1A1A] text-white hover:bg-[#222] border border-[#2A2A2A]",
        ghost: "text-[#AAAAAA] hover:bg-[#1A1A1A] hover:text-white rounded-xl",
        link: "text-[#00FF87] underline-offset-4 hover:underline p-0 h-auto rounded-none",
        purple:
          "bg-[#7C3AED] text-white hover:bg-[#6D28D9] hover:shadow-[0_0_20px_rgba(124,58,237,0.35)]",
        pink: "bg-[#EC4899] text-white hover:bg-[#DB2777] hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
