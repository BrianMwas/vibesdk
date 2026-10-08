import { Avatar, AvatarFallback, Container, Grid, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

const testimonialItems = [
  { quote: "A specific, believable sentence about the result this person got.", name: "Client Name", role: "Role, Organisation" },
  { quote: "A specific, believable sentence about the result this person got.", name: "Client Name", role: "Role, Organisation" },
  { quote: "A specific, believable sentence about the result this person got.", name: "Client Name", role: "Role, Organisation" },
];

function testimonialInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <Section tone="muted">
      <Container>
        <Stack gap="2xl">
          <SectionHeader title="What clients say" align="center" />
          <Grid cols={3}>
            {testimonialItems.map((item, index) => (
              <figure key={index} className="flex flex-col justify-between gap-6 rounded-lg border bg-card p-6 text-card-foreground">
                <blockquote className="text-base leading-relaxed">“{item.quote}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">{testimonialInitials(item.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground">{item.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
