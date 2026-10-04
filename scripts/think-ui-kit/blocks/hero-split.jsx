import { MotionConfig, motion } from "motion/react";
import { AspectRatio, Button, Container, Inline, Section } from "./vendor/ui-kit.js";

// Replace with a photo URL from the search_images tool, or remove the image column.
const heroSplitImage = { src: "", alt: "" };

const heroSplitEase = [0.2, 0, 0, 1];
const heroSplitGroup = { hidden: {}, shown: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const heroSplitRise = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: heroSplitEase } },
};

export default function HeroSplit() {
  return (
    <MotionConfig reducedMotion="user">
      <Section spacing="lg">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div variants={heroSplitGroup} initial="hidden" animate="shown" className="flex flex-col items-start gap-6">
            <motion.h1 variants={heroSplitRise} className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A headline that says plainly what you do
            </motion.h1>
            <motion.p variants={heroSplitRise} className="max-w-xl text-lg text-muted-foreground">
              One or two sentences on who this is for and the outcome they get.
            </motion.p>
            <motion.div variants={heroSplitRise}>
              <Inline gap="sm">
                <Button size="lg">Primary action</Button>
                <Button size="lg" variant="outline">
                  Secondary action
                </Button>
              </Inline>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(6% 6% 6% 6% round 12px)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 12px)" }}
            transition={{ duration: 0.9, ease: heroSplitEase, delay: 0.25 }}
          >
            <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-xl bg-muted">
              {heroSplitImage.src ? (
                <img
                  src={heroSplitImage.src}
                  alt={heroSplitImage.alt}
                  className="size-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              ) : null}
            </AspectRatio>
          </motion.div>
        </Container>
      </Section>
    </MotionConfig>
  );
}
