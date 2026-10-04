import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  Textarea,
  toast,
} from "./vendor/ui-kit.js";

// Controlled: render once and pass the record to open, e.g. from DataTable's onOpenRecord.
export default function RecordSheet({ record, open, onOpenChange }) {
  function handleSubmit(event) {
    event.preventDefault();
    onOpenChange(false);
    toast("Changes saved");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6 text-left">
          <SheetTitle>{record?.name ?? "Record"}</SheetTitle>
          <SheetDescription>{record?.id ?? "Edit the details and save."}</SheetDescription>
        </SheetHeader>
        <form id="record-sheet-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="record-name">Name</Label>
            <Input id="record-name" defaultValue={record?.name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="record-status">Status</Label>
            <Select defaultValue={record?.status ?? "Active"}>
              <SelectTrigger id="record-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="record-notes">Notes</Label>
            <Textarea id="record-notes" rows={5} placeholder="Anything the next person should know" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="record-notify">Notify participants</Label>
              <span className="text-sm text-muted-foreground">Send an update when this record changes.</span>
            </div>
            <Switch id="record-notify" defaultChecked />
          </div>
        </form>
        <SheetFooter className="border-t p-6">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" form="record-sheet-form">
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
