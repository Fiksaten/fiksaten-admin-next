"use client";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";

interface Analytics {
  operations: {
    orderStatusBreakdown: { status: string; count: number }[];
  };
  marketing: {
    userGrowth: { date: string; count: number }[];
    userRoles: { role: string; count: number }[];
  };
}

export default function AdminDashboardClient({
  analytics,
}: {
  analytics: Analytics;
}) {
  // Prepare chart data
  const orderStatusData = analytics.operations.orderStatusBreakdown.map(
    (o: { status: string; count: number }) => ({
      status: o.status,
      count: o.count,
    })
  );
  const userGrowthData = analytics.marketing.userGrowth.map(
    (u: { month: string; count: number }) => ({
      month: u.month,
      count: Number(u.count),
    })
  );
  const userRoleData = analytics.marketing.userRoleDistribution.map(
    (r: { role: string; count: number }) => ({
      role: r.role,
      count: r.count,
    })
  );
  const popularCategoriesData = analytics.marketing.popularCategories.map(
    (c: { name: string; order_count: number }) => ({
      name: c.name,
      order_count: Number(c.order_count),
    })
  );
  const expressCategoryUsageData = analytics.marketing.expressCategoryUsage.map(
    (c: { name: string; express_order_count: number }) => ({
      name: c.name,
      express_order_count: Number(c.express_order_count),
    })
  );

  const revenueByCategoryData = analytics.finance.revenueByCategory.map(
    (c: { name: string; revenue: string }) => ({
      name: c.name,
      revenue: Number(c.revenue),
    })
  );
  const ticketVolumeData = analytics.support.ticketVolume.map(
    (t: { status: string; count: number }) => ({
      status: t.status,
      count: t.count,
    })
  );

  // Chart configs for color and label
  const statusChartConfig: ChartConfig = {
    ...orderStatusData.reduce(
      (acc: ChartConfig, cur: { status: string }, i: number) => {
        acc[cur.status] = {
          label: cur.status,
          color: `var(--chart-${(i % 5) + 1})`,
        };
        return acc;
      },
      {} as ChartConfig
    ),
  };
  const roleChartConfig: ChartConfig = {
    ...userRoleData.reduce(
      (acc: ChartConfig, cur: { role: string }, i: number) => {
        acc[cur.role] = {
          label: cur.role,
          color: `var(--chart-${(i % 5) + 1})`,
        };
        return acc;
      },
      {} as ChartConfig
    ),
  };
  const ticketChartConfig: ChartConfig = {
    ...ticketVolumeData.reduce(
      (acc: ChartConfig, cur: { status: string }, i: number) => {
        acc[cur.status] = {
          label: cur.status,
          color: `var(--chart-${(i % 5) + 1})`,
        };
        return acc;
      },
      {} as ChartConfig
    ),
  };

  // Summary cards
  const summaryCards = [
    {
      title: "Total Orders",
      value: analytics.operations.totalOrders,
    },
    {
      title: "Total Express Orders",
      value: analytics.operations.totalExpressOrders,
    },
    {
      title: "Avg Completion Time (h)",
      value: analytics.operations.avgCompletionTime,
    },
    {
      title: "Avg Offers per Order",
      value: analytics.operations.avgOffersPerOrder,
    },
    {
      title: "Cities Covered",
      value: analytics.operations.citiesCovered,
    },
    {
      title: "Total Revenue (€)",
      value: analytics.finance.totalRevenue,
    },
    {
      title: "Outstanding Payments (€)",
      value: analytics.finance.outstandingPayments,
    },
    {
      title: "Avg Order Value (€)",
      value: analytics.finance.avgOrderValue,
    },
    {
      title: "Repeat Customers",
      value: analytics.marketing.repeatCustomers,
    },
    {
      title: "Support Tickets",
      value: analytics.support.ticketVolume.reduce(
        (a: number, b: { count: number }) => a + b.count,
        0
      ),
    },
    {
      title: "Avg Ticket Resolution (h)",
      value: analytics.support.avgResolutionTime,
    },
    {
      title: "Reviews",
      value: analytics.support.reviewCount,
    },
  ];

  function numberFormat(n: number | null | undefined) {
    if (n == null) return "-";
    return n.toLocaleString("fi-FI");
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl">
                {numberFormat(Number(card.value))}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={statusChartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart data={orderStatusData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="var(--chart-1)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowthData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={roleChartConfig}
              className="min-h-[250px] w-full"
            >
              <PieChart>
                <Pie
                  data={userRoleData}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {userRoleData.map((entry: { role: string; count: number }, i: number) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={`var(--chart-${(i % 5) + 1})`}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={popularCategoriesData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="order_count" fill="var(--chart-2)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Express Category Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Express Category Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={expressCategoryUsageData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="express_order_count"
                  fill="var(--chart-3)"
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={revenueByCategoryData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="var(--chart-4)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Support Ticket Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Support Ticket Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={ticketChartConfig}
              className="min-h-[250px] w-full"
            >
              <BarChart data={ticketVolumeData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="var(--chart-1)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
