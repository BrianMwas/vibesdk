import { Button, Container, Section } from "./vendor/ui-kit.js";

export default function CtaBand() {
  return (
    <Section tone="primary" spacing="sm">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">A short closing invitation</h2>
          <p className="text-primary-foreground/80">One sentence on what happens when they reach out.</p>
        </div>
        <Button size="lg" variant="secondary" asChild>
          <a href="#contact">Primary action</a>
        </Button>
      </Container>
    </Section>
  );
}
