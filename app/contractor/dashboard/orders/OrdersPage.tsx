'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, DollarSignIcon } from 'lucide-react'

type ExtendedOrder = RequestOrder & OrderDetails

type RequestOrder = {
    orderId: string;
    title: string;
    description: string;
    budget: string;
    status: string;
    startDate: string;
    endDate: string;
    orderCreatedAt: string;
    orderUpdatedAt: string;
    categoryName: string;
    categoryDescription: string;
    categoryImageUrl: string;
    offersCount: number;
    offerCreatedAt: string;
    orderTimeLabel: string;
    isOfferSent: boolean;
};

type OrderDetails = {
    orderId: string;
    offerId?: string;
    userId: string;
    contractorId: string;
    categoryId: string;
    title: string;
    description: string;
    attachments: string;
    budget: string;
    status: string;
    orderStreet: string;
    orderCity: string;
    orderZip: string;
    locationMoreInfo: string;
    scheduleOption: string;
    paymentMethod: string;
    categoryName: string;
    startDate: string;
    endDate: string;
    orderCreatedAt: string;
    orderUpdatedAt: string;
    userFirstname: string;
    userLastname: string;
    userEmail: string;
    userAddressStreet: string;
    userAddressDetail: string;
    userAddressZip: string;
    userAddressCountry: string;
    userRole: string;
    categoryCategoryName: string;
    categoryCategoryImageUrl: string;
    categoryDescription: string;
};

const dummyOrders: ExtendedOrder[] = [
  {
    orderId: '1',
    title: 'Website Development',
    description: 'Create a responsive website for a small business',
    budget: '5000',
    status: 'open',
    startDate: '2023-06-01',
    endDate: '2023-07-01',
    orderCreatedAt: '2023-05-15T10:00:00Z',
    orderUpdatedAt: '2023-05-15T10:00:00Z',
    categoryName: 'Web Development',
    categoryDescription: 'Web development services',
    categoryImageUrl: '/placeholder.svg?height=100&width=100',
    offersCount: 3,
    offerCreatedAt: '2023-05-16T14:30:00Z',
    orderTimeLabel: '2 weeks ago',
    isOfferSent: false,
    userId: 'user1',
    contractorId: 'contractor1',
    categoryId: 'category1',
    attachments: '',
    orderStreet: '123 Main St',
    orderCity: 'Anytown',
    orderZip: '12345',
    locationMoreInfo: 'Near the city center',
    scheduleOption: 'Flexible',
    paymentMethod: 'Credit Card',
    userFirstname: 'John',
    userLastname: 'Doe',
    userEmail: 'john.doe@example.com',
    userAddressStreet: '456 Oak St',
    userAddressDetail: 'Apt 7',
    userAddressZip: '67890',
    userAddressCountry: 'USA',
    userRole: 'Client',
    categoryCategoryName: 'Web Development',
    categoryCategoryImageUrl: '/placeholder.svg?height=100&width=100',
  },
  {
    orderId: '2',
    title: 'Logo Design',
    description: 'Design a modern logo for a tech startup',
    budget: '1000',
    status: 'in-progress',
    startDate: '2023-05-20',
    endDate: '2023-06-10',
    orderCreatedAt: '2023-05-10T09:00:00Z',
    orderUpdatedAt: '2023-05-20T11:00:00Z',
    categoryName: 'Graphic Design',
    categoryDescription: 'Graphic design services',
    categoryImageUrl: '/placeholder.svg?height=100&width=100',
    offersCount: 5,
    offerCreatedAt: '2023-05-12T13:45:00Z',
    orderTimeLabel: '3 weeks ago',
    isOfferSent: true,
    userId: 'user2',
    contractorId: 'contractor2',
    categoryId: 'category2',
    attachments: 'logo_brief.pdf',
    orderStreet: '789 Elm St',
    orderCity: 'Tech City',
    orderZip: '54321',
    locationMoreInfo: 'Remote work possible',
    scheduleOption: 'Fixed',
    paymentMethod: 'PayPal',
    userFirstname: 'Jane',
    userLastname: 'Smith',
    userEmail: 'jane.smith@example.com',
    userAddressStreet: '101 Pine St',
    userAddressDetail: 'Suite 200',
    userAddressZip: '13579',
    userAddressCountry: 'Canada',
    userRole: 'Client',
    categoryCategoryName: 'Graphic Design',
    categoryCategoryImageUrl: '/placeholder.svg?height=100&width=100',
  },
  // Add more dummy orders as needed
];

function OrderCard({ order }: { order: ExtendedOrder }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className='text-lg text-black font-semibold'>{order.title}</CardTitle>
        <CardDescription>{order.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Badge variant="secondary">{order.categoryName}</Badge>
          <Badge variant="outline">{order.status}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span>{order.orderCity}, {order.orderZip}</span>
          </div>
          <div className="flex items-center">
            <DollarSignIcon className="mr-2 h-4 w-4" />
            <span>Budget: ${order.budget}</span>
          </div>
          <div>
            Offers: {order.offersCount}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  )
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('open')

  const filteredOrders = dummyOrders.filter(order => {
    if (activeTab === 'history') {
      return ['completed', 'cancelled'].includes(order.status)
    }
    return order.status === activeTab
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-black">Orders</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-200">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        {['open', 'in-progress', 'sent', 'history'].map((status) => (
          <TabsContent key={status} value={status}>
            <h2 className="text-2xl font-semibold mb-4 capitalize text-black">{status} Orders</h2>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <OrderCard key={order.orderId} order={order} />
              ))
            ) : (
              <p>No {status} orders found.</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}