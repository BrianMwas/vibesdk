import { AspectRatio, Button, Container, Inline, Section, Stack } from "./vendor/ui-kit.js";

// Replace with a photo URL from the search_images tool, or remove the image column.
const heroSplitImage = { src: "", alt: "" };

export default function HeroSplit() {
  return (
    <Section spacing="lg">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Stack gap="lg" align="start">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A headline that says plainly what you do
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            One or two sentences on who this is for and the outcome they get.
          </p>
          <Inline gap="sm">
            <Button size="lg">Primary action</Button>
            <Button size="lg" variant="outline">
              Secondary action
            </Button>
          </Inline>
        </Stack>
        <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-xl bg-muted">
          {heroSplitImage.src ? (
            <img
              src={heroSplitImage.src}
              alt={heroSplitImage.alt}
              className="size-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
            />
          ) : null}
        </AspectRatio>
      </Container>
    </Section>
  );
}
