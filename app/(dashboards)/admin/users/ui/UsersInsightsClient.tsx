"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

type Props = {
  insights: {
    totals: { total: number; admins: number; contractors: number; consumers: number; activeThisMonth: number };
    growthLast12: Array<{ month: string; count: number }>;
    roleBreakdown: Array<{ role: string; count: number }>;
    topEmailsByActivity: Array<{ email: string | null; actions: number }>;
  };
};

export default function UsersInsightsClient({ insights }: Props) {
  const chartConfig = useMemo(
    () => ({
      users: { label: "Users", color: "hsl(var(--chart-1))" },
    }),
    []
  );

  const growth = [...insights.growthLast12].reverse();

  return (
    <div className="grid gap-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.total.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.admins.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Contractors</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.contractors.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Consumers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.consumers.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">New This Month</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.activeThisMonth.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>User Growth (Last 12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[320px] aspect-auto overflow-visible">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ top: 24, right: 24, bottom: 12, left: 16 }}>
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickMargin={8} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tickMargin={8} domain={[0, 'dataMax + 2']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="count" name="Users" type="monotone" stroke="var(--color-users)" fill="url(#fillUsers)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.roleBreakdown.map((r) => (
                <div key={r.role} className="flex items-center justify-between">
                  <Badge variant="secondary">{r.role}</Badge>
                  <span className="text-sm text-muted-foreground">{r.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Emails by Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topEmailsByActivity.map((u, idx) => (
                <div key={(u.email ?? idx.toString()) + idx} className="flex items-center justify-between">
                  <div className="truncate max-w-[220px]">{u.email ?? "Unknown"}</div>
                  <Badge variant="outline">{u.actions}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


