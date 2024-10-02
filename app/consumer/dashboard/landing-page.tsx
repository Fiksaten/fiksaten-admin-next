import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Calendar, MapPin, DollarSign } from "lucide-react"

type Order = {
  attachments: string;
  budget: string;
  categoryImageUrl: string;
  categoryName: string;
  categoryDescription: string;
  categoryId: string;
  contractorId: string;
  orderContractorId: string;
  date: string;
  description: string;
  endDate: string;
  endTime: string;
  locationMoreInfo: string;
  offerContractorId: string;
  offerCreatedAt: string;
  offerDescription: string;
  offerId: string;
  offerPrice: string;
  offerUpdatedAt: string;
  orderCity: string;
  orderCreatedAt: string;
  orderId: string;
  orderStreet: string;
  orderUpdatedAt: string;
  orderZip: string;
  paymentMethod: string;
  scheduleOption: string;
  startDate: string;
  startTime: string;
  status: string;
  title: string;
  userId: string;
  orderOfferCount: number;
};

export function LandingPage({ latestOrders, ownOrders }: { latestOrders: Order[], ownOrders: Order[] }) {

  if (latestOrders.length === 0 && ownOrders.length === 0) {
    return( <div className="container mx-auto px-4 py-8 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No orders found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Own Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No orders found</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex justify-center">
        <Button className="w-full md:w-auto">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Order
        </Button>
      </div>
    </div>
  )
}
 
  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {latestOrders.slice(0, 5).map((order) => (
                <div key={order.orderId} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{order.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{order.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(order.startDate).toLocaleDateString()}</span>
                    <MapPin className="w-4 h-4 ml-4 mr-1" />
                    <span>{order.orderCity}</span>
                    <DollarSign className="w-4 h-4 ml-4 mr-1" />
                    <span>{order.budget}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Own Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {ownOrders?.map((order) => (
                <div key={order.orderId} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{order.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{order.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(order.startDate).toLocaleDateString()}</span>
                    <MapPin className="w-4 h-4 ml-4 mr-1" />
                    <span>{order.orderCity}</span>
                    <DollarSign className="w-4 h-4 ml-4 mr-1" />
                    <span>{order.budget}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex justify-center">
        <Button className="w-full md:w-auto">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Order
        </Button>
      </div>
    </div>
  )
}