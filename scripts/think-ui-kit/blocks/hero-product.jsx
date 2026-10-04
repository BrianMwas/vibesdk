import { ArrowRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Button, Container, Inline } from "./vendor/ui-kit.js";

// Optional news line above the headline; leave the label empty to hide it.
const heroProductAnnouncement = { label: "", href: "#" };

// A screenshot of the product (or a search_images result). Leave src empty to
// show HeroProductScreen, and rewrite that sample screen for this product.
const heroProductImage = { src: "", alt: "" };

const heroProductEase = [0.2, 0, 0, 1];
const heroProductGroup = { hidden: {}, shown: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const heroProductRise = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: heroProductEase } },
};

const heroProductNav = ["Overview", "Orders", "Customers", "Reports"];
const heroProductStats = [
  { label: "Revenue", value: "$48,210", change: "+12%" },
  { label: "Orders", value: "1,284", change: "+8%" },
  { label: "Returning", value: "64%", change: "+3%" },
];
const heroProductBars = [38, 52, 44, 61, 57, 72, 66, 80, 74, 88, 82, 95];
const heroProductRows = [
  { name: "Order 4821", status: "Paid", amount: "$240.00" },
  { name: "Order 4820", status: "Shipped", amount: "$1,180.00" },
  { name: "Order 4819", status: "Paid", amount: "$96.50" },
];

function HeroProductScreen() {
  return (
    <div className="grid h-full grid-cols-1 text-left text-xs sm:grid-cols-[11rem_minmax(0,1fr)] sm:text-sm">
      <aside className="hidden flex-col gap-1 border-r bg-muted/40 p-3 sm:flex">
        <div className="mb-3 h-5 w-20 rounded-sm bg-foreground/80" />
        {heroProductNav.map((item, index) => (
          <div
            key={item}
            className={index === 0 ? "rounded-md bg-background px-2 py-1.5 font-medium shadow-sm" : "px-2 py-1.5 text-muted-foreground"}
          >
            {item}
          </div>
        ))}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-col gap-4 p-3 sm:p-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {heroProductStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-background p-3">
              <div className="text-muted-foreground">{stat.label}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-sm font-semibold tabular-nums sm:text-xl">{stat.value}</span>
                <span className="hidden text-primary sm:inline">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex min-h-24 flex-1 items-end gap-1.5 rounded-lg border bg-background p-3 sm:gap-2">
          {heroProductBars.map((height, index) => (
            <motion.div
              key={index}
              className="flex-1 origin-bottom rounded-sm bg-primary/80"
              style={{ height: `${height}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, ease: heroProductEase, delay: 0.9 + index * 0.04 }}
            />
          ))}
        </div>
        <div className="hidden flex-col divide-y rounded-lg border bg-background sm:flex">
          {heroProductRows.map((row) => (
            <div key={row.name} className="flex items-center justify-between gap-3 px-3 py-2">
              <span>{row.name}</span>
              <span className="text-muted-foreground">{row.status}</span>
              <span className="tabular-nums">{row.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroProduct() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden pt-20 sm:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-gradient-to-b from-primary/10 to-transparent" />
        <Container size="md">
          <motion.div variants={heroProductGroup} initial="hidden" animate="shown" className="flex flex-col items-center gap-6 text-center">
            {heroProductAnnouncement.label ? (
              <motion.a
                variants={heroProductRise}
                href={heroProductAnnouncement.href}
                className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {heroProductAnnouncement.label}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </motion.a>
            ) : null}
            <motion.h1 variants={heroProductRise} className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              A headline that says plainly what the product does
            </motion.h1>
            <motion.p variants={heroProductRise} className="max-w-2xl text-lg text-muted-foreground">
              One or two sentences on who it is for and the outcome they get in their first week.
            </motion.p>
            <motion.div variants={heroProductRise}>
              <Inline gap="sm" justify="center">
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
          </motion.div>
        </Container>
        <Container size="xl" className="mt-14 sm:mt-20">
          <motion.div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-t-xl border border-b-0 bg-card shadow-2xl shadow-primary/10"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: heroProductEase, delay: 0.35 }}
          >
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="size-2.5 rounded-full bg-foreground/15" />
              <span className="mx-auto h-5 w-48 rounded-md bg-background/80" />
            </div>
            <div className="aspect-[4/3] sm:aspect-[16/9]">
              {heroProductImage.src ? (
                <img src={heroProductImage.src} alt={heroProductImage.alt} className="size-full object-cover object-top" />
              ) : (
                <HeroProductScreen />
              )}
            </div>
          </motion.div>
        </Container>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>
    </MotionConfig>
  );
}
