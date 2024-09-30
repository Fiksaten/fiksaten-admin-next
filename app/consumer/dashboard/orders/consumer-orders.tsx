'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ChevronRight, Clock } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
export type Offer = {
  date: string | null;
  id: string;
  created_at: string;
  updated_at: string;
  contractorId: string;
  orderId: string;
  categoryId: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  offerPrice: string | null;
  materialCost: string | null;
  offerDescription: string | null;
}
export type OrdersMy = {
  orderId: string;
  userId: string;
  contractorId: string | null;
  categoryId: string;
  title: string | null;
  description: string | null;
  attachments: string | null;
  budget: string | null;
  status: string;
  orderStreet: string | null;
  orderCity: string | null;
  orderZip: string | null;
  locationMoreInfo: string | null;
  scheduleOption: string | null;
  paymentMethod: string | null;
  categoryName: string | null;
  startDate: string | null;
  endDate: string | null;
  orderCreatedAt: string;
  orderUpdatedAt: string;
  categoryImageUrl: string | null;
  categoryDescription: string | null;
  orderOfferCount: number;
  offers: Offer[];
}

export default function ConsumerOrdersComponent({ orders }: { orders: OrdersMy[] }) {
  const [activeTab, setActiveTab] = useState('active')

  const activeOrders = orders.filter(order => order.status !== 'done')
  const completedOrders = orders.filter(order => order.status === 'done')

  const OrderCard = ({ order, isActive }: { order: OrdersMy, isActive: boolean }) => (
    <Card className={`mb-4 ${isActive ? 'hover:shadow-md transition-shadow' : ''}`}>
      <CardHeader>
        <CardTitle>{order.title}</CardTitle>
        <CardDescription>
          <Badge className='mr-2'>{order.categoryName}</Badge>
          <Badge variant="outline" className='font-bold '>{order.status.toUpperCase()}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <div className="flex items-center mb-2">
          <Clock className="mr-2 h-4 w-4" />
          <span>
          {`${format(new Date(order.startDate || ''), 'dd.MM.yyyy')}`} - {`${format(new Date(order.endDate || ''), 'dd.MM.yyyy')}`}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <span className="font-bold">{order.budget} €</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Offers</p>
          <span className="font-bold">{order.orderOfferCount || 0}</span>
        </div>
        <div>{order.orderCity}</div>
      </CardFooter>
      {isActive && (
        <Link href={`/consumer/dashboard/orders/${order.orderId}`} passHref>
          <Button variant="ghost" className="w-full flex justify-between items-center">
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </Card>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeOrders.map(order => (
            <OrderCard key={order.orderId} order={order} isActive={true} />
          ))}
        </TabsContent>
        <TabsContent value="history">
          {completedOrders.map(order => (
            <OrderCard key={order.orderId} order={order} isActive={false} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}