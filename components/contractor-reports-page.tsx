"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Metrics } from '@/app/lib/types';

const MetricCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ContractorMetricsDashboard = ({ metrics }: { metrics: Metrics }) => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl text-black font-bold mb-4">Metrics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} />
        <MetricCard title="Total Projects" value={metrics.totalProjects} />
        <MetricCard title="Average Budget" value={parseFloat(metrics.avgBudget).toFixed(2)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard title="Offer Acceptance Rate" value={`${(metrics.offerAcceptanceRate * 100).toFixed(2)}%`} />
        <MetricCard title="Retention Rate" value={`${(metrics.retentionRate * 100).toFixed(2)}%`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Common Categories by count</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.mostCommonCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoryName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="categoryCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Clients by revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {metrics.topClients.map((client) => (
              <li key={client.userId} className="flex justify-between items-center">
                <span>{client.name}</span>
                <span className="font-semibold">${client.totalRevenue.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractorMetricsDashboard;