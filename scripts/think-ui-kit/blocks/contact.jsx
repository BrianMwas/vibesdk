import { Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  Input,
  Label,
  Section,
  SectionHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  Textarea,
  toast,
} from "./vendor/ui-kit.js";

const contactDetails = [
  { icon: MapPin, label: "Office", value: "Street, Building, City" },
  { icon: Clock, label: "Hours", value: "Mon – Fri, 8:00 – 17:00" },
  { icon: Phone, label: "Phone", value: "+000 000 000 000" },
  { icon: Mail, label: "Email", value: "hello@example.com" },
];

const contactTopics = ["General enquiry", "Book a consultation", "Something else"];

export default function Contact() {
  function handleSubmit(event) {
    event.preventDefault();
    event.currentTarget.reset();
    toast("Thanks — we'll get back to you within one working day.");
  }

  return (
    <Section id="contact">
      <Container>
        <Grid cols={2} gap="2xl" className="items-start">
          <Stack gap="xl">
            <SectionHeader title="Get in touch" description="Tell us a little about what you need and we'll reply within one working day." />
            <dl className="flex flex-col gap-5">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-sm font-medium">{label}</dt>
                    <dd className="text-sm text-muted-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Stack>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send a message</CardTitle>
              <CardDescription>All fields are kept confidential.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input id="contact-name" name="name" required autoComplete="name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-topic">Topic</Label>
                  <Select name="topic" defaultValue={contactTopics[0]}>
                    <SelectTrigger id="contact-topic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contactTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea id="contact-message" name="message" rows={4} required />
                </div>
                <Button type="submit" className="self-start">
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}
