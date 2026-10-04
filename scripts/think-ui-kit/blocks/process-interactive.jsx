import { useRef, useState } from "react";
import { CalendarCheck, Check, ClipboardList, MessageSquare, Sparkles } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { Container, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

// The real steps, in order. Give a step an image (a screenshot or a search_images
// result) to show it in the panel; otherwise the panel lists its details.
const processInteractiveSteps = [
  {
    icon: MessageSquare,
    title: "Tell us what you need",
    body: "One or two sentences on what happens in this step.",
    details: ["A concrete thing the customer does or gets", "Another concrete detail", "How long this step takes"],
    image: { src: "", alt: "" },
  },
  {
    icon: ClipboardList,
    title: "Get a clear plan",
    body: "One or two sentences on what happens in this step.",
    details: ["A concrete thing the customer does or gets", "Another concrete detail", "How long this step takes"],
    image: { src: "", alt: "" },
  },
  {
    icon: CalendarCheck,
    title: "We get to work",
    body: "One or two sentences on what happens in this step.",
    details: ["A concrete thing the customer does or gets", "Another concrete detail", "How long this step takes"],
    image: { src: "", alt: "" },
  },
  {
    icon: Sparkles,
    title: "Enjoy the result",
    body: "One or two sentences on what happens in this step.",
    details: ["A concrete thing the customer does or gets", "Another concrete detail", "How long this step takes"],
    image: { src: "", alt: "" },
  },
];

const processInteractiveEase = [0.2, 0, 0, 1];
// How long each step stays selected while the section plays through once on its own.
const processInteractiveStepMs = 5000;

function ProcessInteractivePanel({ step, index }) {
  const Icon = step.icon;
  if (step.image.src) {
    return <img src={step.image.src} alt={step.image.alt} className="size-full object-cover" />;
  }
  return (
    <div className="flex size-full flex-col justify-between gap-8 p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground [&_svg]:size-6">
          <Icon aria-hidden="true" />
        </span>
        <span className="text-6xl font-semibold tabular-nums tracking-tight text-foreground/10 sm:text-8xl" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{step.title}</h3>
        <ul className="flex flex-col gap-3">
          {step.details.map((detail) => (
            <li key={detail} className="flex items-start gap-3 rounded-lg border bg-background/70 px-4 py-3 text-sm sm:text-base">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ProcessInteractive() {
  const section = useRef(null);
  const inView = useInView(section, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  // Plays through the steps once, and stops for good as soon as the visitor takes over.
  const [autoplay, setAutoplay] = useState(true);
  const playing = autoplay && inView && !reduced;
  const stop = () => setAutoplay(false);

  const advance = () => {
    if (active >= processInteractiveSteps.length - 1) setAutoplay(false);
    else setActive(active + 1);
  };

  const step = processInteractiveSteps[active];
  return (
    <MotionConfig reducedMotion="user">
      <Section id="how-it-works" tone="muted">
        <Container>
          <Stack gap="2xl">
            <SectionHeader title="How it works" description="A short line that sets expectations: how long it takes and what the customer has to do." />
            <div
              ref={section}
              onPointerEnter={stop}
              onFocusCapture={stop}
              className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
            >
              <ol className="flex flex-col gap-1">
                {processInteractiveSteps.map((item, index) => {
                  const current = index === active;
                  return (
                    <li key={item.title} className="relative">
                      {current ? (
                        <motion.span
                          layoutId="process-interactive-highlight"
                          className="absolute inset-0 rounded-lg border bg-background shadow-sm"
                          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                        />
                      ) : null}
                      <button
                        type="button"
                        aria-current={current ? "step" : undefined}
                        onClick={() => {
                          stop();
                          setActive(index);
                        }}
                        className="relative flex w-full flex-col gap-2 overflow-hidden rounded-lg p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
                      >
                        <span className="flex items-center gap-4">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors duration-300 ${
                              current ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground ring-1 ring-border"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className={`text-base font-semibold transition-colors duration-300 ${current ? "" : "text-muted-foreground"}`}>{item.title}</span>
                        </span>
                        <AnimatePresence initial={false}>
                          {current ? (
                            <motion.span
                              key="body"
                              className="block overflow-hidden pl-12 text-muted-foreground"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: processInteractiveEase }}
                            >
                              {item.body}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                        {current && playing ? (
                          <span className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                            <motion.span
                              key={active}
                              className="block h-full origin-left bg-primary"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: processInteractiveStepMs / 1000, ease: "linear" }}
                              onAnimationComplete={advance}
                            />
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="relative h-[26rem] overflow-hidden rounded-xl border bg-card shadow-sm sm:aspect-[4/3] sm:h-auto lg:sticky lg:top-24">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.15, ease: "easeOut" } }}
                    transition={{ duration: 0.35, ease: processInteractiveEase }}
                  >
                    <ProcessInteractivePanel step={step} index={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Stack>
        </Container>
      </Section>
    </MotionConfig>
  );
}
