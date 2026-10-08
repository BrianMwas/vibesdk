import { CalendarCheck, FileText, MessageSquare, ShieldCheck, Users, Wallet } from "lucide-react";
import { Container, Grid, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

const featureGridItems = [
  { icon: ShieldCheck, title: "First feature", body: "One sentence on what it does for the reader, in their terms." },
  { icon: CalendarCheck, title: "Second feature", body: "One sentence on what it does for the reader, in their terms." },
  { icon: Wallet, title: "Third feature", body: "One sentence on what it does for the reader, in their terms." },
  { icon: FileText, title: "Fourth feature", body: "One sentence on what it does for the reader, in their terms." },
  { icon: MessageSquare, title: "Fifth feature", body: "One sentence on what it does for the reader, in their terms." },
  { icon: Users, title: "Sixth feature", body: "One sentence on what it does for the reader, in their terms." },
];

export default function FeatureGrid() {
  return (
    <Section id="services">
      <Container>
        <Stack gap="2xl">
          <SectionHeader
            title="What we help with"
            description="A short line that frames the group of services or features below."
          />
          <Grid cols={3} gap="xl">
            {featureGridItems.map(({ icon: Icon, title, body }) => (
              <Stack key={title} gap="sm" align="start">
                <div className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-5">
                  <Icon />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
