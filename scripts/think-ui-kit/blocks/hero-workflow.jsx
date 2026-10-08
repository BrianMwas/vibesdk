import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ClipboardCheck, Inbox, Send, UserRound } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { Button, Container, Inline } from "./vendor/ui-kit.js";

// The business's real process, in order. `waiting` shows before a step runs.
const heroWorkflowSteps = [
  { icon: Inbox, title: "Request comes in", waiting: "Website, phone or email" },
  { icon: ClipboardCheck, title: "We review the details", waiting: "Scope, timing and budget" },
  { icon: UserRound, title: "Matched with a specialist", waiting: "Based on the job" },
  { icon: Send, title: "You get a clear plan", waiting: "Price and start date" },
];

// Sample runs through the steps: one result per step and the total time.
const heroWorkflowRuns = [
  { name: "Kitchen refit, 3 rooms", results: ["From the website", "Fits the June calendar", "Assigned to Dana", "Plan sent by email"], total: "2 days" },
  { name: "Office move, 40 desks", results: ["By phone", "Needs a weekend crew", "Assigned to Marco", "Plan sent by email"], total: "1 day" },
  { name: "Bathroom repair", results: ["From the website", "Small job, next week", "Assigned to Priya", "Plan sent by text"], total: "4 hours" },
];

const heroWorkflowEase = [0.2, 0, 0, 1];
const heroWorkflowStepMs = 1100;
const heroWorkflowHoldMs = 2800;
const heroWorkflowGroup = { hidden: {}, shown: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const heroWorkflowRise = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: heroWorkflowEase } },
};
const heroWorkflowSwap = {
  initial: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  transition: { type: "spring", duration: 0.3, bounce: 0 },
};

function HeroWorkflowStatus({ status }) {
  return (
    <span className="relative flex size-6 shrink-0 items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        {status === "done" ? (
          <motion.span key="done" {...heroWorkflowSwap} className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" strokeWidth={2.5} role="img" aria-label="Done" />
          </motion.span>
        ) : status === "running" ? (
          <motion.span key="running" {...heroWorkflowSwap} className="flex size-6 items-center justify-center">
            <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary motion-reduce:animate-none" role="img" aria-label="In progress" />
          </motion.span>
        ) : (
          <motion.span key="idle" {...heroWorkflowSwap} className="flex size-6 items-center justify-center">
            <span className="size-2 rounded-full bg-muted-foreground/40" role="img" aria-label="Waiting" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function HeroWorkflowCanvas() {
  const canvas = useRef(null);
  const visible = useInView(canvas, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [run, setRun] = useState({ index: 0, count: 1, active: -1 });
  const total = heroWorkflowSteps.length;

  useEffect(() => {
    if (reduced || !visible) return;
    const finished = run.active >= total;
    const timer = window.setTimeout(
      () =>
        setRun((current) =>
          current.active >= total
            ? { index: (current.index + 1) % heroWorkflowRuns.length, count: current.count + 1, active: 0 }
            : { ...current, active: current.active + 1 },
        ),
      finished ? heroWorkflowHoldMs : run.active < 0 ? 700 : heroWorkflowStepMs,
    );
    return () => window.clearTimeout(timer);
  }, [run, reduced, visible, total]);

  const nextExample = () =>
    setRun((current) => ({ index: (current.index + 1) % heroWorkflowRuns.length, count: current.count + 1, active: reduced ? total : 0 }));

  const example = heroWorkflowRuns[run.index];
  // Reduced motion: each example is shown already finished.
  const active = reduced ? total : run.active;
  const statusOf = (index) => (index < active ? "done" : index === active ? "running" : "idle");
  const finished = active >= total;

  return (
    <div ref={canvas} className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-primary/5">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <span className={`size-2 shrink-0 rounded-full ${visible || reduced ? "bg-primary" : "bg-muted-foreground/40"}`} aria-hidden="true" />
          <span className="truncate">{example.name}</span>
        </span>
        <Button variant="secondary" size="sm" onClick={nextExample}>
          Next example
        </Button>
      </div>
      <div
        className="p-4 sm:p-6"
        style={{ backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      >
        <ol className="flex flex-col" aria-label={`How a request moves through, example: ${example.name}`}>
          {heroWorkflowSteps.map((step, index) => {
            const status = statusOf(index);
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex flex-col">
                <div
                  className={`flex items-center gap-3 rounded-lg border bg-background px-3 py-3 transition-[border-color,box-shadow] duration-300 sm:px-4 ${
                    status === "running" ? "border-primary/60 shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]" : ""
                  }`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-4">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{step.title}</span>
                    <span className="truncate text-xs text-muted-foreground sm:text-sm">
                      {status === "done" ? example.results[index] : status === "running" ? "Working on it" : step.waiting}
                    </span>
                  </span>
                  <HeroWorkflowStatus status={status} />
                </div>
                {index < total - 1 ? (
                  <span className="relative ml-[1.875rem] h-5 w-px bg-border sm:ml-[2.125rem]" aria-hidden="true">
                    <motion.span
                      className="absolute inset-0 origin-top bg-primary"
                      initial={false}
                      animate={{ scaleY: index < active ? 1 : 0 }}
                      transition={{ duration: index < active ? 0.35 : 0, ease: heroWorkflowEase }}
                    />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
        <span className="text-muted-foreground">
          Example <span className="tabular-nums">{run.count}</span>
        </span>
        <span className={finished ? "flex items-center gap-1.5 font-medium" : "text-muted-foreground"}>
          {finished ? (
            <>
              <Check className="size-4 text-primary" aria-hidden="true" />
              Done in {example.total}
            </>
          ) : active < 0 ? (
            "Starting"
          ) : (
            `Step ${active + 1} of ${total}`
          )}
        </span>
      </div>
    </div>
  );
}

export default function HeroWorkflow() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-muted/70 to-transparent" />
        <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <motion.div variants={heroWorkflowGroup} initial="hidden" animate="shown" className="flex flex-col items-start gap-6">
            <motion.h1 variants={heroWorkflowRise} className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A headline about the result, not the process
            </motion.h1>
            <motion.p variants={heroWorkflowRise} className="max-w-xl text-lg text-muted-foreground">
              One or two sentences on who this is for. The panel shows how a request moves from first contact to a finished plan.
            </motion.p>
            <motion.div variants={heroWorkflowRise}>
              <Inline gap="sm">
                <Button size="lg" asChild>
                  <a href="#contact">
                    Primary action
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">Secondary action</a>
                </Button>
              </Inline>
            </motion.div>
            <motion.p variants={heroWorkflowRise} className="text-sm text-muted-foreground">
              One reassuring fact, such as how fast people hear back.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: heroWorkflowEase, delay: 0.3 }}
          >
            <HeroWorkflowCanvas />
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}
