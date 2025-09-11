"use client";

import type {
  GetCampaignOrderDetailsResponses,
  GetExpressOrderDetailsResponses,
  GetOrderDetailsResponses,
  GetOrderImagesResponses,
} from "@/app/lib/openapi-client";
import { updateOrder } from "@/app/lib/services/orderService";
import BusinessMetrics from "@/components/BusinessMetrics";
import CustomerServiceActions from "@/components/CustomerServiceActions";
import ImageGallery from "@/components/ImageGallery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderData =
  | GetOrderDetailsResponses[200]
  | GetExpressOrderDetailsResponses[200]
  | GetCampaignOrderDetailsResponses[200];

interface Props {
  orderData: OrderData;
  images: GetOrderImagesResponses[200];
  orderType: string;
  accessToken: string;
}

export default function OrderDetailsPage({
  orderData,
  images,
  orderType,
  accessToken,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "accepted":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "declined":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "waitingForPayment":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "done":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "expired":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "declined":
        return <AlertTriangle className="h-4 w-4" />;
      case "waitingForPayment":
        return <DollarSign className="h-4 w-4" />;
      case "done":
        return <Star className="h-4 w-4" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fi-FI", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string | number | null) => {
    if (!price) return "Ei määritelty";
    return new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(Number(price));
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const orderId = isNormalOrder ? orderData.order.id : orderData.id;
      await updateOrder(accessToken, orderId, { status: newStatus as any });
      toast({ title: "Tilauksen tila päivitetty" });
      router.refresh();
    } catch {
      toast({
        title: "Virhe",
        description: "Tilauksen tilan päivitys epäonnistui",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isNormalOrder = "order" in orderData;
  const isExpressOrder = "qna" in orderData;
  const isCampaignOrder = !isNormalOrder && !isExpressOrder;

  const order = isNormalOrder ? orderData.order : orderData;
  const user = isNormalOrder
    ? orderData.order.user
    : isExpressOrder
    ? orderData.user
    : null;
  const category = isNormalOrder
    ? orderData.order.category
    : isExpressOrder
    ? orderData.category
    : null;
  const city = isNormalOrder
    ? orderData.order.city
    : isExpressOrder
    ? orderData.city
    : null;

  if (!user || !category || !city) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Tietoja puuttuu
          </h1>
          <p className="text-muted-foreground mb-4">
            Tilauksen tiedoista puuttuu tärkeitä tietoja. Tarkista API-vastaus.
          </p>
          <Button onClick={() => router.back()}>Takaisin</Button>
        </div>
      </div>
    );
  }

  // Calculate business metrics
  const calculateRevenue = () => {
    if (isNormalOrder) {
      const acceptedOffer = orderData.order.offers.find(
        (offer) => offer.status === "accepted"
      );
      return acceptedOffer?.offerPrice || orderData.order.budget || 0;
    }
    if (isExpressOrder && category?.expressPrice) {
      return Number(category.expressPrice);
    }
    return 0;
  };

  const calculateDaysToCompletion = () => {
    if (order.doneAt) {
      const created = new Date(order.createdAt);
      const done = new Date(order.doneAt);
      return Math.ceil(
        (done.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    return null;
  };

  const getCustomerRisk = () => {
    const orderAge = Math.ceil(
      (new Date().getTime() - new Date(order.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (order.status === "expired")
      return {
        level: "high",
        text: "Korkea riski - vanhentunut",
        color: "text-red-600",
      };
    if (order.status === "declined")
      return {
        level: "high",
        text: "Korkea riski - hylätty",
        color: "text-red-600",
      };
    if (orderAge > 14 && order.status === "pending")
      return {
        level: "high",
        text: "Korkea riski - viivästynyt",
        color: "text-red-600",
      };
    if (orderAge > 7 && order.status === "pending")
      return {
        level: "medium",
        text: "Keskiriski - hitaasti etenevä",
        color: "text-orange-600",
      };
    if (order.status === "done")
      return {
        level: "low",
        text: "Matala riski - valmistunut",
        color: "text-green-600",
      };
    return {
      level: "low",
      text: "Matala riski - normaali",
      color: "text-green-600",
    };
  };

  const revenue = calculateRevenue();
  const daysToCompletion = calculateDaysToCompletion();
  const customerRisk = getCustomerRisk();

  return (
    <div className="space-y-8">
      {/* Simple Clean Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tilauksen tiedot
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {orderType === "express"
                  ? "Express-tilaus"
                  : orderType === "campaign"
                  ? "Kampanjatilaus"
                  : "Normaali tilaus"}{" "}
                #{order.id}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Badge className={`${getStatusColor(order.status)} border`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {order.status === "pending" && "Odottaa"}
                  {order.status === "accepted" && "Hyväksytty"}
                  {order.status === "declined" && "Hylätty"}
                  {order.status === "waitingForPayment" && "Odottaa maksua"}
                  {order.status === "done" && "Valmis"}
                  {order.status === "expired" && "Vanhentunut"}
                </div>
              </Badge>
              <Button variant="outline" onClick={() => router.back()}>
                ← Takaisin
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Key Metrics in Header */}
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{formatPrice(revenue)}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Arvo
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold">
                {daysToCompletion ? `${daysToCompletion} pv` : "Kesken"}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Läpimenoaika
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold">
                {isNormalOrder
                  ? orderData.order.offers.length
                  : orderType === "express"
                  ? "⚡"
                  : "🎯"}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {isNormalOrder ? "Tarjouksia" : "Tyyppi"}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <AlertTriangle
                className={`h-5 w-5 mx-auto mb-1 ${customerRisk.color}`}
              />
              <div className="text-lg font-bold">
                {Math.ceil(
                  (new Date().getTime() - new Date(order.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                pv
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Ikä
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BusinessMetrics order={order} orderType={orderType} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md">
            Yleiskatsaus
          </TabsTrigger>
          <TabsTrigger value="images" className="rounded-md">
            Kuvat
          </TabsTrigger>
          <TabsTrigger value="details" className="rounded-md">
            Yksityiskohdat
          </TabsTrigger>
          {isNormalOrder && (
            <TabsTrigger value="offers" className="rounded-md">
              Tarjoukset
            </TabsTrigger>
          )}
          {isExpressOrder && (
            <TabsTrigger value="qna" className="rounded-md">
              Kysymykset
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      Tilauksen tiedot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Tilaus ID
                        </span>
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {order.id}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Luotu
                        </span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Päivitetty
                        </span>
                        <span>{formatDate(order.updatedAt)}</span>
                      </div>
                      {order.doneAt && (
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Valmistunut
                          </span>
                          <span>{formatDate(order.doneAt)}</span>
                        </div>
                      )}
                      {isNormalOrder && orderData.order.budget && (
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Budjetti
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatPrice(orderData.order.budget)}
                          </span>
                        </div>
                      )}
                      {isExpressOrder && category?.expressPrice && (
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Express-hinta
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatPrice(category.expressPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <User className="h-5 w-5" />
                      </div>
                      Asiakkaan tiedot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <Avatar className="h-12 w-12 border-2 border-green-200 dark:border-green-800">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          {user.firstname?.[0]}
                          {user.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {user.phoneNumber && (
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Asiakas ID
                        </span>
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {user.id}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Information */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Building2 className="h-5 w-5" />
                      </div>
                      Kategorian tiedot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Kategoria
                        </span>
                        <span className="font-semibold">{category.name}</span>
                      </div>
                      {category.description && (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                            Kuvaus
                          </span>
                          <p className="text-sm">{category.description}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Kategoria ID
                        </span>
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {category.id}
                        </span>
                      </div>
                      {category.express && (
                        <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                          >
                            Express
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <MapPin className="h-5 w-5" />
                      </div>
                      Sijainti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Kaupunki
                        </span>
                        <span className="font-semibold">{city.cityName}</span>
                      </div>
                      {order.orderStreet && (
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Katu
                          </span>
                          <span>{order.orderStreet}</span>
                        </div>
                      )}
                      {order.orderZip && (
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Postinumero
                          </span>
                          <span>{order.orderZip}</span>
                        </div>
                      )}
                      {/* @ts-ignore */}
                      {order?.locationMoreInfo && (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                            Lisätiedot
                          </span>
                          {/* @ts-ignore */}
                          <p className="text-sm">{order?.locationMoreInfo}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Timing Information */}
                {(isExpressOrder || isCampaignOrder) && (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
                          <Clock className="h-5 w-5" />
                        </div>
                        Aikataulu
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Aloitusaika
                          </span>
                          <span>{formatTime(orderData.startTime)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Lopetusaika
                          </span>
                          <span>{formatTime(orderData.endTime)}</span>
                        </div>
                        {orderData.chosenDay && (
                          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Valittu päivä
                            </span>
                            <span>{formatDate(orderData.chosenDay)}</span>
                          </div>
                        )}
                        {orderData.chosenStartTime && (
                          <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Valittu aika
                            </span>
                            <span>{formatTime(orderData.chosenStartTime)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contractor Information */}
                {order.contractorId && (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                          <Shield className="h-5 w-5" />
                        </div>
                        Urakoitsijan tiedot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Urakoitsija ID
                          </span>
                          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {order.contractorId}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <CustomerServiceActions user={user} order={order} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <ImageGallery images={images.images} />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                Yksityiskohdat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isNormalOrder && orderData.order.description && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Kuvaus
                  </p>
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {orderData.order.description}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                  Tilauksen tila
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "pending",
                    "accepted",
                    "declined",
                    "waitingForPayment",
                    "done",
                    "expired",
                  ].map((status) => (
                    <Button
                      key={status}
                      variant={order.status === status ? "default" : "outline"}
                      size="sm"
                      disabled={loading}
                      onClick={() => handleStatusUpdate(status)}
                      className={
                        order.status === status
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }
                    >
                      {status === "pending" && "Odottaa"}
                      {status === "accepted" && "Hyväksytty"}
                      {status === "declined" && "Hylätty"}
                      {status === "waitingForPayment" && "Odottaa maksua"}
                      {status === "done" && "Valmis"}
                      {status === "expired" && "Vanhentunut"}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isNormalOrder && (
          <TabsContent value="offers" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  Tarjoukset ({orderData.order.offers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.order.offers.length > 0 ? (
                  <div className="space-y-4">
                    {orderData.order.offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-lg">
                              Urakoitsija ID: {offer.contractorId}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {offer.date && formatDate(offer.date)}
                              {offer.startTime &&
                                ` ${formatTime(offer.startTime)}`}
                            </p>
                          </div>
                          <Badge
                            variant={
                              offer.status === "accepted"
                                ? "default"
                                : "secondary"
                            }
                            className="px-3 py-1"
                          >
                            {offer.status === "pending" && "Odottaa"}
                            {offer.status === "accepted" && "Hyväksytty"}
                            {offer.status === "declined" && "Hylätty"}
                          </Badge>
                        </div>
                        {offer.offerPrice && (
                          <p className="text-2xl font-bold text-green-600 mb-2">
                            {formatPrice(offer.offerPrice)}
                          </p>
                        )}
                        {offer.materialCost && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Materiaalikulut: {formatPrice(offer.materialCost)}
                          </p>
                        )}
                        {offer.offerDescription && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            {offer.offerDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ei tarjouksia saatavilla
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isExpressOrder && (
          <TabsContent value="qna" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  Kysymykset ja vastaukset ({orderData.qna.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.qna.length > 0 ? (
                  <div className="space-y-4">
                    {orderData.qna.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50"
                      >
                        <div className="space-y-3">
                          <p className="font-semibold text-lg text-purple-800 dark:text-purple-200">
                            {item.question.questionText}
                          </p>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Vastaus:
                            </p>
                            <p className="text-gray-800 dark:text-gray-200">
                              {item.answer}
                            </p>
                          </div>
                          {item.question.affectsPrice && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            >
                              Vaikuttaa hintaan
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ei kysymyksiä saatavilla
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
