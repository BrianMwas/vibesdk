import { useRef } from "react";
import { Check } from "lucide-react";
import { MotionConfig, motion, useInView } from "motion/react";
import { Container, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

// Three to five steps, in the order a customer goes through them. `outcome` is what they have after the step.
const processSteps = [
  { title: "Tell us what you need", body: "One or two sentences on what happens in this step and who does it.", outcome: "A reply within one working day" },
  { title: "Get a clear plan", body: "One or two sentences on what happens in this step and who does it.", outcome: "A fixed price and a start date" },
  { title: "We do the work", body: "One or two sentences on what happens in this step and who does it.", outcome: "Updates at every milestone" },
  { title: "Review and sign off", body: "One or two sentences on what happens in this step and who does it.", outcome: "Nothing to pay until you approve" },
];

const processStepsEase = [0.2, 0, 0, 1];
const processStepsGap = 0.45;
const processStepsColumns = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

export default function ProcessSteps() {
  const list = useRef(null);
  const inView = useInView(list, { once: true, amount: 0.3 });
  const state = inView ? "shown" : "hidden";
  return (
    <MotionConfig reducedMotion="user">
      <Section id="how-it-works">
        <Container>
          <Stack gap="2xl">
            <SectionHeader
              title="How it works"
              description="A short line that sets expectations: how long it takes and what the customer has to do."
            />
            <ol ref={list} className={`grid gap-10 lg:gap-8 ${processStepsColumns[processSteps.length] ?? "lg:grid-cols-4"}`}>
              {processSteps.map((step, index) => {
                const delay = 0.1 + index * processStepsGap;
                const last = index === processSteps.length - 1;
                return (
                  <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-6">
                    {last ? null : (
                      <span
                        aria-hidden="true"
                        className="absolute left-5 top-12 -bottom-8 w-px bg-border lg:-right-6 lg:bottom-auto lg:left-12 lg:top-5 lg:h-px lg:w-auto"
                      >
                        <motion.span
                          className="absolute inset-0 hidden origin-left bg-primary lg:block"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: inView ? 1 : 0 }}
                          transition={{ duration: processStepsGap, ease: "linear", delay: delay + 0.2 }}
                        />
                        <motion.span
                          className="absolute inset-0 origin-top bg-primary lg:hidden"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: inView ? 1 : 0 }}
                          transition={{ duration: processStepsGap, ease: "linear", delay: delay + 0.2 }}
                        />
                      </span>
                    )}
                    <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium tabular-nums text-muted-foreground">
                      {index + 1}
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.6 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0, delay }}
                      >
                        {index + 1}
                      </motion.span>
                    </span>
                    <motion.div
                      className="flex flex-col gap-2 pt-1.5 lg:pt-0"
                      initial="hidden"
                      animate={state}
                      variants={{
                        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                        shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: processStepsEase, delay } },
                      }}
                    >
                      <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                      <p className="text-muted-foreground">{step.body}</p>
                      {step.outcome ? (
                        <p className="mt-2 flex items-start gap-2 text-sm font-medium">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          {step.outcome}
                        </p>
                      ) : null}
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </Stack>
        </Container>
      </Section>
    </MotionConfig>
  );
}
