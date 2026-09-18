import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-zinc-950 shadow hover:bg-zinc-200",
        secondary:
          "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-850",
        destructive:
          "border-transparent bg-red-900/60 text-red-200 border-red-800/40",
        outline:
          "border-zinc-800 text-zinc-400",
        tag:
          "border-zinc-850 bg-zinc-900/80 text-zinc-300 font-mono text-[11px] uppercase tracking-wider",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
