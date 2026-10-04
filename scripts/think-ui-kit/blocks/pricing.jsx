import { Check } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  Section,
  SectionHeader,
  Stack,
  cn,
} from "./vendor/ui-kit.js";

const pricingPlans = [
  { name: "Starter", price: "KES 0", period: "", description: "For trying it out.", features: ["First inclusion", "Second inclusion", "Third inclusion"], cta: "Get started" },
  { name: "Standard", price: "KES 4,900", period: "/ month", description: "For most clients.", features: ["Everything in Starter", "Second inclusion", "Third inclusion", "Fourth inclusion"], cta: "Choose Standard", featured: true },
  { name: "Premium", price: "KES 12,000", period: "/ month", description: "For complex needs.", features: ["Everything in Standard", "Second inclusion", "Third inclusion"], cta: "Talk to us" },
];

export default function Pricing() {
  return (
    <Section id="pricing">
      <Container>
        <Stack gap="2xl">
          <SectionHeader title="Pricing" description="Plain prices, no surprises." align="center" />
          <Grid cols={3} className="items-start">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={cn("flex flex-col", plan.featured && "border-primary shadow-md")}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.featured ? <Badge>Most chosen</Badge> : null}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tabular-nums tracking-tight">{plan.price}</span>
                    {plan.period ? <span className="text-sm text-muted-foreground">{plan.period}</span> : null}
                  </div>
                  <ul className="flex flex-col gap-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.featured ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
