import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium tracking-wide",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111009]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",  // Emil: tactile press feedback
  ],
  {
    variants: {
      variant: {
        // Raw Clay — primary CTA
        default:
          "rounded-[8px] bg-[#C8A882] text-[#111009] font-semibold hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.3)]",
        // Terracotta — destructive / warm action
        destructive:
          "rounded-[8px] bg-[#B5704F] text-[#F2EDE6] hover:bg-[#A5603F]",
        // Outlined — secondary action
        outline:
          "rounded-[8px] border border-[#2C271F] bg-transparent text-[#A89880] hover:bg-[#1A1712] hover:border-[#3A3328] hover:text-[#F2EDE6]",
        // Ghost
        secondary:
          "rounded-[8px] bg-[#1A1712] text-[#A89880] hover:bg-[#221E18] hover:text-[#F2EDE6] border border-[#2C271F]",
        ghost:
          "rounded-[8px] text-[#6B5E50] hover:bg-[#1A1712] hover:text-[#A89880]",
        link:
          "text-[#C8A882] underline-offset-4 hover:underline p-0 h-auto rounded-none",
        // Sage — agent / success actions
        sage:
          "rounded-[8px] bg-[#8A9E8C]/20 text-[#8A9E8C] border border-[#8A9E8C]/25 hover:bg-[#8A9E8C]/30",
      },
      size: {
        default: "h-9 px-5 py-2 text-[13px]",
        sm:      "h-7 px-3.5 text-[12px]",
        lg:      "h-11 px-7 text-[14px]",
        xl:      "h-13 px-9 text-[15px]",
        icon:    "h-8 w-8 rounded-[8px]",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
