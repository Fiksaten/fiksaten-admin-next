"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Building2,
    DollarSign,
    Star,
    Target,
    Zap
} from "lucide-react";

interface BusinessMetricsProps {
  order: any;
  orderType: string;
}

export default function BusinessMetrics({ order, orderType }: BusinessMetricsProps) {
  const calculateOrderAge = () => {
    const created = new Date(order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgress = () => {
    const statusProgress = {
      "pending": 20,
      "accepted": 40,
      "waitingForPayment": 60,
      "done": 100,
      "expired": 0,
      "declined": 0
    };
    return statusProgress[order.status as keyof typeof statusProgress] || 0;
  };

  const calculateRevenue = () => {
    // This would need access to offers for normal orders or category pricing
    if (order.budget) return Number(order.budget);
    return 0;
  };


  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Simple Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Tilauksen tilanne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valmistumisaste</span>
              <Badge variant={progress === 100 ? "default" : progress === 0 ? "destructive" : "secondary"}>
                {progress}%
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateOrderAge()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">päivää käynnissä</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arvo</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {calculateRevenue() > 0 ? `€${calculateRevenue()}` : "Ei määritelty"}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {order.status === "done" ? "Toteutunut" : "Arvioitu"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tyyppi</CardTitle>
            {orderType === "express" ? <Zap className="h-4 w-4 text-yellow-600" /> : 
             orderType === "campaign" ? <Star className="h-4 w-4 text-purple-600" /> : 
             <Building2 className="h-4 w-4 text-blue-600" />}
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {orderType === "express" ? "Express" : 
               orderType === "campaign" ? "Kampanja" : "Normaali"}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {orderType === "express" ? "Nopea toteutus" : 
               orderType === "campaign" ? "Erikoistarjous" : "Standardi prosessi"}
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
