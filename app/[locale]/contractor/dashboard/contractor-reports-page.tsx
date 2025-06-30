"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

      
    </div>
  );
};

export default ContractorMetricsDashboard;