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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  insights: {
    totals: { sent: number; read: number; unread: number; readRate: number };
    byType: Array<{ type: string; sent: number; read: number }>;
    last30Days: Array<{ date: string; sent: number; read: number }>;
    topUsersByUnread: Array<{ userId: string; email: string | null; unread: number }>;
  };
};

export default function NotificationsInsightsClient({ insights }: Props) {
  const chartConfig = useMemo(
    () => ({
      sent: { label: "Sent", color: "hsl(var(--chart-1))" },
      read: { label: "Read", color: "hsl(var(--chart-2))" },
    }),
    []
  );

  return (
    <div className="grid gap-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Sent</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.sent.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Read</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.read.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {insights.totals.unread.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Read Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {(insights.totals.readRate * 100).toFixed(1)}%
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[360px] aspect-auto overflow-visible">
            <ResponsiveContainer>
              <AreaChart data={insights.last30Days} margin={{ top: 24, right: 24, bottom: 12, left: 16 }}>
                <defs>
                  <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sent)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-sent)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillRead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-read)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-read)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickMargin={8} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tickMargin={8} domain={[0, 'dataMax + 2']} />
                <ChartTooltip content={<ChartTooltipContent />} wrapperStyle={{ zIndex: 50 }} />
                <Area
                  dataKey="sent"
                  type="monotone"
                  stroke="var(--color-sent)"
                  fill="url(#fillSent)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="read"
                  type="monotone"
                  stroke="var(--color-read)"
                  fill="url(#fillRead)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>By Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.byType
                .slice()
                .sort((a, b) => {
                  const ar = a.sent > 0 ? a.read / a.sent : 0;
                  const br = b.sent > 0 ? b.read / b.sent : 0;
                  if (br !== ar) return br - ar;
                  return b.sent - a.sent;
                })
                .map((t) => {
                  const rate = t.sent > 0 ? (t.read / t.sent) * 100 : 0;
                  return (
                    <div key={t.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{t.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t.read}/{t.sent} • {rate.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Users by Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topUsersByUnread.map((u) => (
                <div key={u.userId} className="flex items-center justify-between">
                  <div className="truncate">
                    <div className="font-medium truncate max-w-[220px]">
                      {u.email ?? u.userId}
                    </div>
                  </div>
                  <Badge variant="outline">{u.unread}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


