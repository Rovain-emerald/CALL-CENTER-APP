import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-2 text-sm text-white",
      "placeholder:text-[#555]",
      "transition-[border-color,box-shadow] duration-150",
      "focus-visible:outline-none focus-visible:border-[#00FF87] focus-visible:ring-1 focus-visible:ring-[#00FF87]/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
