"use client";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Clock,
  MapPin,
  Star,
  MessageCircle,
  Activity,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { format } from "date-fns";
import { AdminAnalytics } from "@/app/lib/types/analyticsTypes";

export default function AdminDashboardClient({
  analytics,
}: {
  analytics: AdminAnalytics;
}) {
  const colors = {
    charts: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "#06b6d4",
      "#f97316",
      "#84cc16",
    ],
    primary: "hsl(var(--primary))",
    success: "hsl(var(--chart-2))",
    warning: "hsl(var(--chart-3))",
    destructive: "hsl(var(--destructive))",
  };

  const formatNumber = (value: number | string | null): string => {
    if (value === null || value === undefined) return "—";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "—";

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString("fi-FI");
  };

  const formatCurrency = (value: number | string | null): string => {
    if (value === null || value === undefined) return "—";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "—";

    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `€${(num / 1000).toFixed(1)}K`;
    }
    return `€${num.toLocaleString("fi-FI")}`;
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd.MM.yyyy");
  };

  const summaryCards = [
    {
      title: "Total Orders",
      value: formatNumber(analytics.operations.totalOrders),
      icon: Package,
      category: "operations",
    },
    {
      title: "Express Orders",
      value: formatNumber(analytics.operations.totalExpressOrders),
      icon: Clock,
      category: "operations",
    },
    {
      title: "Avg Completion Time",
      value: analytics.operations.avgCompletionTime
        ? `${analytics.operations.avgCompletionTime}h`
        : "—",
      icon: Target,
      category: "operations",
    },
    {
      title: "Cities Covered",
      value: formatNumber(analytics.operations.citiesCovered),
      icon: MapPin,
      category: "operations",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.finance.totalRevenue),
      icon: DollarSign,
      category: "finance",
    },
    {
      title: "Outstanding Payments",
      value: formatCurrency(analytics.finance.outstandingPayments),
      icon: DollarSign,
      category: "finance",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(analytics.finance.avgOrderValue),
      icon: Activity,
      category: "finance",
    },
    {
      title: "Repeat Customers",
      value: formatNumber(analytics.marketing.repeatCustomers),
      icon: Users,
      category: "users",
    },
    {
      title: "Support Tickets",
      value: formatNumber(
        analytics.support.ticketVolume.reduce((a, b) => a + b.count, 0)
      ),
      icon: MessageCircle,
      category: "support",
    },
    {
      title: "Customer Reviews",
      value: formatNumber(analytics.support.reviewCount),
      icon: Star,
      category: "support",
    },
  ];

  const userGrowthData = analytics.marketing.userGrowth.map((u) => ({
    month: u.month, 
    count: Number(u.count),
  }));

  const revenueData = analytics.finance.revenueByCategory.map((c) => ({
    name: c.name,
    revenue: Number(c.revenue),
  }));

  const notificationData = analytics.marketing.notificationStats.map((n) => ({
    type: n.type,
    sent: n.sent,
    read: n.read,
    readRate: n.sent > 0 ? ((n.read / n.sent) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Comprehensive overview of platform performance and key metrics
              </p>
            </div>
          </div>
          <Separator className="my-6" />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {summaryCards.slice(0, 10).map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.title}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            {card.title}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {card.value}
                          </p>
                        </div>
                        <div className="p-2 bg-muted rounded-lg">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp
                      className="h-5 w-5"
                      style={{ color: colors.primary }}
                    />
                    User Growth Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly user acquisition over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData.reverse()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatDate}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "white", color: "black" }} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={colors.primary}
                        strokeWidth={3}
                        dot={{
                          fill: colors.primary,
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{ r: 6, fill: colors.primary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package
                      className="h-5 w-5"
                      style={{ color: colors.primary }}
                    />
                    Order Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Current breakdown of order statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.operations.orderStatusBreakdown}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="status"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "white", color: "black" }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {analytics.operations.orderStatusBreakdown.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors.charts[index % colors.charts.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                  <CardDescription>
                    Top-performing categories by order volume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.marketing.popularCategories}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "white", color: "black" }} />
                      <Bar dataKey="order_count" radius={[4, 4, 0, 0]}>
                        {analytics.marketing.popularCategories.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors.charts[index % colors.charts.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Express Delivery Usage</CardTitle>
                  <CardDescription>
                    Express orders by product category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.marketing.expressCategoryUsage}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip contentStyle={{ backgroundColor: "white", color: "black" }} />
                      <Bar dataKey="express_order_count" radius={[4, 4, 0, 0]}>
                        {analytics.marketing.expressCategoryUsage.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors.charts[index % colors.charts.length]}
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Financial performance across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Revenue",
                        ]}
                        contentStyle={{ backgroundColor: "white", color: "black" }}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {revenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors.charts[index % colors.charts.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {summaryCards
                  .filter((card) => card.category === "finance")
                  .map((card) => {
                    const Icon = card.icon;
                    
                    return (
                      <Card key={card.title}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">
                                {card.title}
                              </p>
                              <p className="text-xl font-bold text-foreground">
                                {card.value}
                              </p>
                            </div>
                            <Icon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Role Distribution</CardTitle>
                  <CardDescription>
                    Platform user composition by role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.marketing.userRoleDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ role, percent }) =>
                          `${role} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.marketing.userRoleDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors.charts[index % colors.charts.length]}
                            />
                          )
                        )}
                      </Pie>
                      
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Ticket Status</CardTitle>
                  <CardDescription>
                    Current support ticket breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.support.ticketVolume}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percent }) =>
                          `${status} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.support.ticketVolume.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors.charts[index % colors.charts.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "white", color: "black" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {analytics.marketing.notificationStats.length > 0 && (
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Notification Performance</CardTitle>
                    <CardDescription>
                      Message delivery and engagement rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={notificationData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="type"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <Tooltip contentStyle={{ backgroundColor: "white", color: "black" }} />
                        <Legend />
                        <Bar
                          dataKey="sent"
                          fill={colors.charts[0]}
                          name="Sent"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="read"
                          fill={colors.charts[1]}
                          name="Read"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
