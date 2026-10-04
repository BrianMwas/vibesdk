import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  toast,
} from "./vendor/ui-kit.js";

export default function FormDialog() {
  const [open, setOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setOpen(false);
    toast("Created");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New item</DialogTitle>
          <DialogDescription>Fill in the details. You can change them later.</DialogDescription>
        </DialogHeader>
        <form id="form-dialog-form" onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="form-dialog-title">Title</Label>
              <Input id="form-dialog-title" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="form-dialog-date">Date</Label>
              <Input id="form-dialog-date" type="date" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="form-dialog-notes">Notes</Label>
            <Textarea id="form-dialog-notes" rows={4} />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-dialog-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
