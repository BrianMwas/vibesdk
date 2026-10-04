import { Menu } from "lucide-react";
import { Button, Container, Sheet, SheetContent, SheetTitle, SheetTrigger } from "./vendor/ui-kit.js";

const marketingNavLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#" className="text-base font-semibold tracking-tight">
          Brand
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {marketingNavLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <a href="#contact">Get in touch</a>
          </Button>
          <Sheet>
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
                    <a href={link.href}>{link.label}</a>
                  </Button>
                ))}
                <Button className="mt-4" asChild>
                  <a href="#contact">Get in touch</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
