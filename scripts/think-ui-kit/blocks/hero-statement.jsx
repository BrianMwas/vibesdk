import { ArrowRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Button, Container, Inline } from "./vendor/ui-kit.js";

const heroStatementTitle = "A short, confident statement of what you do";

// Optional full-bleed photo behind the type (a search_images result). Leave src empty for type on the page color.
const heroStatementImage = { src: "", alt: "" };

// Real customers, partners or press only. Leave empty to hide the row.
const heroStatementNames = [];

const heroStatementEase = [0.2, 0, 0, 1];
const heroStatementWords = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const heroStatementWord = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: heroStatementEase } },
};
const heroStatementRise = (delay) => ({
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: heroStatementEase, delay },
});

export default function HeroStatement() {
  const words = heroStatementTitle.split(" ");
  const afterTitle = 0.15 + words.length * 0.08;
  const photo = Boolean(heroStatementImage.src);
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden">
        {photo ? (
          <>
            <motion.img
              src={heroStatementImage.src}
              alt={heroStatementImage.alt}
              className="absolute inset-0 -z-20 size-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: heroStatementEase }}
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/30" />
          </>
        ) : null}
        <Container className="flex flex-1 flex-col justify-end gap-12 pb-12 pt-24 sm:gap-16 sm:pb-16">
          <motion.h1
            variants={heroStatementWords}
            initial="hidden"
            animate="shown"
            className="max-w-5xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {words.map((word, index) => (
              <motion.span key={index} variants={heroStatementWord} className="inline-block whitespace-pre">
                {index < words.length - 1 ? `${word} ` : word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.div
            {...heroStatementRise(afterTitle)}
            className="flex flex-col gap-8 border-t pt-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-xl text-lg text-muted-foreground">
              One or two sentences on who this is for and why they choose you over the alternatives.
            </p>
            <div className="flex flex-col gap-3 lg:items-end">
              <Inline gap="sm">
                <Button size="lg" asChild>
                  <a href="#contact">
                    Primary action
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#services">Secondary action</a>
                </Button>
              </Inline>
              <p className="text-sm text-muted-foreground">One reassuring fact, such as a free first visit.</p>
            </div>
          </motion.div>
          {heroStatementNames.length > 0 ? (
            <motion.div {...heroStatementRise(afterTitle + 0.15)} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <p className="shrink-0 text-sm text-muted-foreground">Trusted by</p>
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-base font-medium text-foreground/70">
                {heroStatementNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </Container>
      </section>
    </MotionConfig>
  );
}
