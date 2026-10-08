import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge, Grid, StatCard } from "./vendor/ui-kit.js";

const dashboardStats = [
  { label: "Revenue", value: "KES 1.25M", change: "+12.5%", up: true, note: "vs last month" },
  { label: "New clients", value: "1,234", change: "-4%", up: false, note: "vs last month" },
  { label: "Active cases", value: "86", change: "+6%", up: true, note: "12 due this week" },
  { label: "Satisfaction", value: "4.8 / 5", change: "+0.2", up: true, note: "from 210 reviews" },
];

export default function DashboardStats() {
  return (
    <Grid cols={4} gap="md">
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          hint={
            <span className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 font-medium">
                {stat.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {stat.change}
              </Badge>
              {stat.note}
            </span>
          }
        />
      ))}
    </Grid>
  );
}
