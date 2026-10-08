import { Container, Separator } from "./vendor/ui-kit.js";

const footerColumns = [
  { title: "Services", links: ["First service", "Second service", "Third service"] },
  { title: "Company", links: ["About", "Team", "Careers"] },
  { title: "Resources", links: ["Guides", "FAQ", "Contact"] },
];

export default function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-base font-semibold tracking-tight">Brand</span>
            <p className="max-w-xs text-sm text-muted-foreground">One line on what the business does and where.</p>
          </div>
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <span className="text-sm font-medium">{column.title}</span>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Brand. All rights reserved.</span>
          <span>Registered details or licence number</span>
        </div>
      </Container>
    </footer>
  );
}
