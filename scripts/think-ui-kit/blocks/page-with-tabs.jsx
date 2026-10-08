import { Activity, CalendarDays, FileText, Plus, Users, Wallet } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  EmptyState,
  Grid,
  PageHeader,
  Stack,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./vendor/ui-kit.js";

const pageStats = [
  { label: "Open items", value: "12", hint: "3 due this week", icon: <Activity /> },
  { label: "Next date", value: "Fri 17:00", hint: "Confirmed by both parties", icon: <CalendarDays /> },
  { label: "Balance", value: "KES 48,200", hint: "Up 8% this month", icon: <Wallet /> },
  { label: "People", value: "4", hint: "2 pending invites", icon: <Users /> },
];

const pageActivity = [
  { title: "Item updated", detail: "Short description of what changed.", when: "2h ago" },
  { title: "Document added", detail: "Short description of what changed.", when: "Yesterday" },
  { title: "Meeting scheduled", detail: "Short description of what changed.", when: "Mon" },
];

export default function PageWithTabs() {
  return (
    <Container size="xl" className="py-8">
      <Stack gap="xl">
        <PageHeader
          title="Page title"
          description="One line of context for this screen."
          actions={
            <>
              <Button variant="outline">Secondary</Button>
              <Button>
                <Plus /> New item
              </Button>
            </>
          }
        />
        <Tabs defaultValue="overview" className="flex flex-col gap-6">
          <TabsList className="self-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-0">
            <Stack gap="lg">
              <Grid cols={4} gap="md">
                {pageStats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </Grid>
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Main panel</CardTitle>
                    <CardDescription>The primary content for this view.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">Content goes here.</CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Side panel</CardTitle>
                    <CardDescription>Secondary details.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">Content goes here.</CardContent>
                </Card>
              </div>
            </Stack>
          </TabsContent>
          <TabsContent value="activity" className="mt-0">
            <Card>
              <CardContent className="divide-y p-0">
                {pageActivity.map((item) => (
                  <div key={item.title} className="flex items-start justify-between gap-4 p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-sm text-muted-foreground">{item.detail}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.when}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            <EmptyState
              icon={<FileText />}
              title="No documents yet"
              description="Uploaded files will appear here."
              action={<Button variant="outline">Upload a document</Button>}
            />
          </TabsContent>
        </Tabs>
      </Stack>
    </Container>
  );
}
