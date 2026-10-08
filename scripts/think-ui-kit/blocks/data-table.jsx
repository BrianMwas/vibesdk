import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./vendor/ui-kit.js";

const dataTableRows = [
  { id: "REC-1042", name: "First record", owner: "A. Owner", status: "Active", amount: 12500 },
  { id: "REC-1041", name: "Second record", owner: "B. Owner", status: "Pending", amount: 4800 },
  { id: "REC-1040", name: "Third record", owner: "C. Owner", status: "Closed", amount: 31000 },
  { id: "REC-1039", name: "Fourth record", owner: "A. Owner", status: "Active", amount: 950 },
];

const dataTableStatusVariant = { Active: "default", Pending: "secondary", Closed: "outline" };

export default function DataTable({ onOpenRecord }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(
    () =>
      dataTableRows.filter(
        (row) =>
          (status === "all" || row.status === status) &&
          `${row.id} ${row.name} ${row.owner}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, status],
  );

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Records</CardTitle>
          <CardDescription>All records you have access to.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search records"
              className="w-48 pl-8"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.keys(dataTableStatusVariant).map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus /> New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Reference</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12 pr-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No records match your filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-6 font-mono text-xs">{row.id}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{row.owner}</TableCell>
                  <TableCell>
                    <Badge variant={dataTableStatusVariant[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">KES {row.amount.toLocaleString()}</TableCell>
                  <TableCell className="pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${row.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{row.id}</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => onOpenRecord?.(row)}>Open</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4 text-sm text-muted-foreground">
        <span>
          {rows.length} of {dataTableRows.length} records
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
