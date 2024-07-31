import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("yanimate-pulse yrounded-md ybg-slate-100 dark:ybg-slate-800", className)}
      {...props} />)
  );
}

export { Skeleton }
