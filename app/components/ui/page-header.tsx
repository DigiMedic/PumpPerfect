import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({
  heading,
  text,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-lg text-muted-foreground">{text}</p>}
      {children}
    </div>
  )
} 