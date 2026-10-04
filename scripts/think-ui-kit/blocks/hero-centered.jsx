import { Button, Container, Inline, Section, Stack } from "./vendor/ui-kit.js";

export default function HeroCentered() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <Stack gap="lg" align="center" className="text-center">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A headline that says plainly what you do
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            One or two sentences on who this is for and the outcome they get.
          </p>
          <Inline gap="sm" justify="center">
            <Button size="lg">Primary action</Button>
            <Button size="lg" variant="outline">
              Secondary action
            </Button>
          </Inline>
        </Stack>
      </Container>
    </Section>
  );
}
