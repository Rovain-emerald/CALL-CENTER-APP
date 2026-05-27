import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-[8px]",
        "border border-[#2C271F] bg-[#1A1712] px-4 py-2",
        "text-[13px] text-[#F2EDE6] placeholder:text-[#6B5E50]",
        "transition-[border-color,box-shadow] duration-150",
        "focus-visible:outline-none focus-visible:border-[#C8A882]/60 focus-visible:ring-1 focus-visible:ring-[#C8A882]/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
