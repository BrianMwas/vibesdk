import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Input,
  Label,
  PageHeader,
  Separator,
  Stack,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "./vendor/ui-kit.js";

const settingsNotifications = [
  { id: "notify-updates", label: "Updates", description: "When something you follow changes." },
  { id: "notify-reminders", label: "Reminders", description: "Before scheduled dates." },
  { id: "notify-digest", label: "Weekly summary", description: "A short email every Monday." },
];

export default function SettingsPage() {
  return (
    <Container size="md" className="py-8">
      <Stack gap="xl">
        <PageHeader title="Settings" description="Manage your profile and how we contact you." />
        <Tabs defaultValue="profile" className="flex flex-col gap-6">
          <TabsList className="self-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
                <CardDescription>Shown to people you work with.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="settings-name">Full name</Label>
                  <Input id="settings-name" autoComplete="name" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" type="email" autoComplete="email" />
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button onClick={() => toast("Profile saved")}>Save</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Choose what we send you.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                {settingsNotifications.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 ? <Separator className="my-4" /> : null}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <span className="text-sm text-muted-foreground">{item.description}</span>
                      </div>
                      <Switch id={item.id} defaultChecked={index < 2} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Stack>
    </Container>
  );
}
