import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-zinc-950 shadow hover:bg-zinc-200 active:scale-[0.99]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.99]",
        outline:
          "border border-zinc-800 bg-zinc-950/60 text-zinc-200 shadow-sm hover:bg-zinc-900 hover:text-white active:scale-[0.99]",
        secondary:
          "bg-zinc-900 text-zinc-200 shadow-sm hover:bg-zinc-800 active:scale-[0.99]",
        ghost:
          "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
        link:
          "text-white underline-offset-4 hover:underline",
        agency:
          "bg-gradient-to-r from-zinc-100 to-zinc-300 text-zinc-950 font-semibold shadow-md hover:from-white hover:to-zinc-200 transition-all active:scale-[0.99]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
