import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Container, Input, Section, SectionHeader, Stack } from "./vendor/ui-kit.js";

// Questions grouped by topic. Two to five topics, each with real questions visitors ask.
const faqTopics = [
  {
    id: "getting-started",
    label: "Getting started",
    items: [
      { question: "A question real visitors ask?", answer: "A direct answer in two or three sentences." },
      { question: "Another question about getting started?", answer: "A direct answer in two or three sentences." },
    ],
  },
  {
    id: "pricing",
    label: "Pricing and payment",
    items: [
      { question: "A question about price?", answer: "A direct answer in two or three sentences." },
      { question: "A question about paying?", answer: "A direct answer in two or three sentences." },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      { question: "A question about getting help?", answer: "A direct answer in two or three sentences." },
      { question: "A question about response times?", answer: "A direct answer in two or three sentences." },
    ],
  },
];

const faqTopicsEase = [0.2, 0, 0, 1];

function faqTopicsHighlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^$|()[\]{}\\]/g, "\\$&");
  const pattern = new RegExp("(" + escaped + ")", "gi");
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="rounded-sm bg-primary/15 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function FaqTopics() {
  const [topicId, setTopicId] = useState(faqTopics[0].id);
  const [query, setQuery] = useState("");
  const search = query.trim();

  const results = useMemo(() => {
    if (!search) return faqTopics.find((topic) => topic.id === topicId).items.map((item) => ({ ...item, topic: null }));
    const needle = search.toLowerCase();
    return faqTopics.flatMap((topic) =>
      topic.items
        .filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(needle))
        .map((item) => ({ ...item, topic: topic.label })),
    );
  }, [search, topicId]);

  return (
    <MotionConfig reducedMotion="user">
      <Section id="faq">
        <Container>
          <Stack gap="2xl">
            <SectionHeader
              title="Questions"
              description="Answers to what people ask most before they get in touch."
              actions={
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search questions"
                    aria-label="Search questions"
                    className="pl-9"
                  />
                </div>
              }
            />
            <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
              <nav aria-label="Question topics" className={`transition-opacity duration-200 ${search ? "opacity-50" : ""}`}>
                <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
                  {faqTopics.map((topic) => {
                    const current = !search && topic.id === topicId;
                    return (
                      <li key={topic.id} className="relative shrink-0">
                        {current ? (
                          <motion.span
                            layoutId="faq-topics-highlight"
                            className="absolute inset-0 rounded-md bg-muted"
                            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                          />
                        ) : null}
                        <button
                          type="button"
                          aria-current={current ? "true" : undefined}
                          onClick={() => {
                            setQuery("");
                            setTopicId(topic.id);
                          }}
                          className={`relative w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                            current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {topic.label}
                          <span className="ml-2 tabular-nums text-muted-foreground">{topic.items.length}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={search ? "search" : topicId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeOut" } }}
                  transition={{ duration: 0.3, ease: faqTopicsEase }}
                  className="min-w-0"
                >
                  {results.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full border-t">
                      {results.map((item, index) => (
                        <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
                          <AccordionTrigger className="text-left text-base">
                            <span className="flex flex-col gap-1">
                              {item.topic ? <span className="text-xs font-normal text-muted-foreground">{item.topic}</span> : null}
                              <span>{faqTopicsHighlight(item.question, search)}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-base text-muted-foreground">{faqTopicsHighlight(item.answer, search)}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-8">
                      <p className="font-medium">No answers match “{search}”</p>
                      <p className="text-sm text-muted-foreground">Try a shorter word, or ask us directly.</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="#contact">Ask a question</a>
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Stack>
        </Container>
      </Section>
    </MotionConfig>
  );
}
