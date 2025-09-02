import { getaccessToken } from "@/app/lib/actions";
import { getCampaignOrderDetails, getExpressOrderDetails, getOrderDetails, getOrderImages } from "@/app/lib/services/orderService";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import OrderDetailsPage from "./OrderDetailsPage";

interface PageProps {
  params: Promise<{
    orderId: string;
    orderType: string;
  }>;
}

export default async function OrderDetails({ params }: PageProps) {
  const accessToken = await getaccessToken();
  const { orderId, orderType } = await params;

  try {
    let orderData;
    let images;

    // Get order details based on type
    switch (orderType) {
      case "express":
        orderData = await getExpressOrderDetails(accessToken, orderId);
        break;
      case "campaign":
        orderData = await getCampaignOrderDetails(accessToken, orderId);
        break;
      case "normal":
        orderData = await getOrderDetails(accessToken, orderId);
        break;
      default:
        notFound();
    }

    // Get order images
    try {
      images = await getOrderImages(accessToken, orderId);
    } catch (error) {
      console.warn("Could not fetch order images:", error);
      images = { images: [] };
    }

    return (
      <OrderDetailsPage
        orderData={orderData}
        images={images}
        orderType={orderType}
        accessToken={accessToken}
      />
    );
  } catch (error) {
    console.error("Error fetching order details:", error);
    
    // If it's a permission error, show a specific message
    if (error instanceof Error && error.message.includes("Admin access required")) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                          <p className="text-muted-foreground mb-4">
                You don&apos;t have permission to view this order. This may be because:
              </p>
            <ul className="text-sm text-muted-foreground mb-6 text-left max-w-md mx-auto">
              <li>• The order belongs to another user</li>
              <li>• Admin permissions are required</li>
              <li>• The order ID is invalid</li>
            </ul>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      );
    }
    
    notFound();
  }
}
