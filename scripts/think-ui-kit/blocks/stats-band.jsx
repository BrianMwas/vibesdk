import { useEffect, useMemo, useRef } from "react";
import { MotionConfig, animate, motion, useInView, useReducedMotion } from "motion/react";
import { Container, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

// The business's real figures only. `trend` (optional) draws a small line under the number.
const statsBandItems = [
  { label: "Projects delivered", value: 1240, suffix: "+", detail: "Since 2014", trend: [12, 18, 16, 24, 29, 35, 41] },
  { label: "Average reply time", value: 2.5, decimals: 1, suffix: "h", detail: "On working days" },
  { label: "Clients who return", value: 87, suffix: "%", detail: "Within two years", trend: [62, 66, 71, 74, 79, 84, 87] },
  { label: "Average rating", value: 4.9, decimals: 1, suffix: "/5", detail: "From 380 reviews" },
];

const statsBandWithTrends = statsBandItems.some((stat) => stat.trend);
const statsBandEase = [0.2, 0, 0, 1];
const statsBandDuration = 1.6;
const statsBandStagger = 0.12;

function StatsBandNumber({ stat, run, delay }) {
  const live = useRef(null);
  const reduced = useReducedMotion();
  const format = useMemo(() => {
    const digits = new Intl.NumberFormat("en-US", { minimumFractionDigits: stat.decimals ?? 0, maximumFractionDigits: stat.decimals ?? 0 });
    return (value) => digits.format(value);
  }, [stat.decimals]);
  const final = format(stat.value);

  useEffect(() => {
    const node = live.current;
    if (!node) return;
    if (reduced) {
      node.textContent = final;
      return;
    }
    if (!run) {
      node.textContent = format(0);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: statsBandDuration,
      delay,
      ease: statsBandEase,
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
      onComplete: () => {
        node.textContent = final;
      },
    });
    return () => controls.stop();
  }, [run, reduced, delay, stat.value, format, final]);

  return (
    <>
      <span className="sr-only">
        {stat.prefix}
        {final}
        {stat.suffix}
      </span>
      <span aria-hidden="true" className="flex items-baseline text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
        {stat.prefix}
        {/* The final value reserves the width so nothing moves while the digits count. */}
        <span className="relative">
          <span className="invisible">{final}</span>
          <span ref={live} className="absolute inset-0">
            {final}
          </span>
        </span>
        {stat.suffix ? <span className="text-2xl text-muted-foreground sm:text-3xl">{stat.suffix}</span> : null}
      </span>
    </>
  );
}

function StatsBandTrend({ values, run, delay }) {
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const path = values
    .map((value, index) => `${index ? "L" : "M"}${((index / (values.length - 1)) * 100).toFixed(2)} ${(30 - ((value - min) / span) * 26).toFixed(2)}`)
    .join(" ");
  // Revealed with a clip, not pathLength: the dash trick breaks under non-scaling-stroke.
  return (
    <motion.div
      aria-hidden="true"
      initial={{ clipPath: "inset(-4px 100% -4px 0)" }}
      animate={{ clipPath: run ? "inset(-4px 0% -4px 0)" : "inset(-4px 100% -4px 0)" }}
      transition={{ duration: 1.2, ease: statsBandEase, delay: delay + statsBandDuration * 0.5 }}
    >
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full overflow-visible text-primary">
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
}

export default function StatsBand() {
  const list = useRef(null);
  const inView = useInView(list, { once: true, amount: 0.4 });
  return (
    <MotionConfig reducedMotion="user">
      <Section aria-label="Key numbers">
        <Container>
          <Stack gap="2xl">
            <SectionHeader title="The numbers behind the work" description="One line on where these figures come from." />
            <dl ref={list} className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {statsBandItems.map((stat, index) => {
                const delay = index * statsBandStagger;
                return (
                  <div key={stat.label} className="flex flex-col gap-3 bg-background p-6 sm:p-8">
                    <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                    <dd>
                      <StatsBandNumber stat={stat} run={inView} delay={delay} />
                    </dd>
                    {stat.detail ? <dd className="text-sm text-muted-foreground">{stat.detail}</dd> : null}
                    {statsBandWithTrends ? (
                      <dd className="mt-auto h-8">{stat.trend ? <StatsBandTrend values={stat.trend} run={inView} delay={delay} /> : null}</dd>
                    ) : null}
                  </div>
                );
              })}
            </dl>
          </Stack>
        </Container>
      </Section>
    </MotionConfig>
  );
}
