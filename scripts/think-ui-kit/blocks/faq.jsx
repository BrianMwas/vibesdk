import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Container, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

const faqItems = [
  { question: "A question real visitors ask?", answer: "A direct answer in two or three sentences." },
  { question: "A question real visitors ask?", answer: "A direct answer in two or three sentences." },
  { question: "A question real visitors ask?", answer: "A direct answer in two or three sentences." },
  { question: "A question real visitors ask?", answer: "A direct answer in two or three sentences." },
];

export default function Faq() {
  return (
    <Section>
      <Container size="sm">
        <Stack gap="xl">
          <SectionHeader title="Questions" align="center" />
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>
      </Container>
    </Section>
  );
}
