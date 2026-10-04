import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Button, Container, Sheet, SheetContent, SheetTitle, SheetTrigger } from "./vendor/ui-kit.js";

// Each href points at a section id on the page; the link for the section in view is marked current.
const marketingNavLinks = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = marketingNavLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean);
    if (sections.length === 0) return;
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        const first = sections.find((section) => visible.get(section.id));
        setCurrent(first ? `#${first.id}` : null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const highlighted = hovered ?? current;

  return (
    <MotionConfig reducedMotion="user">
      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || menuOpen ? "border-border bg-background/85 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70" : "border-transparent bg-transparent"
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-6">
          <a href="#" className="text-base font-semibold tracking-tight">
            Brand
          </a>
          <nav aria-label="Main" className="hidden md:block" onMouseLeave={() => setHovered(null)}>
            <ul className="flex items-center gap-1">
              {marketingNavLinks.map((link) => (
                <li key={link.href} className="relative">
                  {highlighted === link.href ? (
                    <motion.span
                      layoutId="marketing-header-highlight"
                      className="absolute inset-0 rounded-md bg-muted"
                      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                    />
                  ) : null}
                  <a
                    href={link.href}
                    aria-current={current === link.href ? "location" : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    onBlur={() => setHovered(null)}
                    className={`relative block rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                      highlighted === link.href ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <a href="#contact">Get in touch</a>
            </Button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle>Menu</SheetTitle>
                <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                  {marketingNavLinks.map((link) => (
                    <Button key={link.href} variant="ghost" className="justify-start" asChild>
                      <a href={link.href} onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </a>
                    </Button>
                  ))}
                  <Button className="mt-4" asChild>
                    <a href="#contact" onClick={() => setMenuOpen(false)}>
                      Get in touch
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </MotionConfig>
  );
}
