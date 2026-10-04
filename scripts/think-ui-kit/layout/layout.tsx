import * as React from "react"

import { cn } from "@/lib/utils"

// One spacing scale for every generated page. Class strings are literal so
// Tailwind compiles them into ui-kit.css.

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const

const gaps = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
} as const

const sectionSpacing = {
  sm: "py-10 sm:py-12",
  md: "py-16 sm:py-20",
  lg: "py-20 sm:py-28",
} as const

const sectionTones = {
  default: "",
  muted: "bg-muted/50",
  card: "bg-card text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  inverse: "bg-foreground text-background",
} as const

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const

const alignItems = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const

const justifyContent = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const

type Gap = keyof typeof gaps

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: keyof typeof containerSizes
}

/** Centered page column with responsive side gutters. */
function Container({ size = "lg", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", containerSizes[size], className)}
      {...props}
    />
  )
}

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  spacing?: keyof typeof sectionSpacing
  tone?: keyof typeof sectionTones
}

/** Full-width page band with consistent vertical rhythm. Put a Container inside. */
function Section({ spacing = "md", tone = "default", className, ...props }: SectionProps) {
  return <section className={cn(sectionSpacing[spacing], sectionTones[tone], className)} {...props} />
}

type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: Gap
  align?: keyof typeof alignItems
}

/** Vertical flow with a fixed gap. */
function Stack({ gap = "md", align = "stretch", className, ...props }: StackProps) {
  return <div className={cn("flex flex-col", gaps[gap], alignItems[align], className)} {...props} />
}

type InlineProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: Gap
  align?: keyof typeof alignItems
  justify?: keyof typeof justifyContent
  wrap?: boolean
}

/** Horizontal row (buttons, meta, toolbars) that wraps on narrow screens. */
function Inline({
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = true,
  className,
  ...props
}: InlineProps) {
  return (
    <div
      className={cn(
        "flex flex-row",
        wrap && "flex-wrap",
        gaps[gap],
        alignItems[align],
        justifyContent[justify],
        className
      )}
      {...props}
    />
  )
}

type GridProps = React.HTMLAttributes<HTMLDivElement> & {
  cols?: keyof typeof gridCols
  gap?: Gap
}

/** Responsive grid: one column on phones, `cols` columns on large screens. */
function Grid({ cols = 3, gap = "lg", className, ...props }: GridProps) {
  return <div className={cn("grid", gridCols[cols], gaps[gap], className)} {...props} />
}

type HeaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

/** Title block for a page section; `align="center"` for marketing sections. */
function SectionHeader({
  title,
  description,
  actions,
  align = "left",
  className,
  ...props
}: HeaderProps & { align?: "left" | "center" }) {
  const centered = align === "center"
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div className={cn("flex max-w-2xl flex-col gap-3", centered && "items-center")}>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {description ? <p className="text-base text-muted-foreground sm:text-lg">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/** Title row for an app screen: heading, one line of context, primary actions. */
function PageHeader({ title, description, actions, className, ...props }: HeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

type StatCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
}

/** One KPI: label, large value, optional supporting line. Lay out several in a Grid. */
function StatCard({ label, value, hint, icon, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 rounded-lg border bg-card p-5 text-card-foreground shadow-sm", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{label}</span>
        {icon ? <span className="[&_svg]:size-4">{icon}</span> : null}
      </div>
      <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint ? <div className="text-sm text-muted-foreground">{hint}</div> : null}
    </div>
  )
}

type EmptyStateProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

/** Placeholder for a list or panel with no data yet. */
function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export { Container, EmptyState, Grid, Inline, PageHeader, Section, SectionHeader, Stack, StatCard }
