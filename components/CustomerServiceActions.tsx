"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Copy,
    ExternalLink, FileText, History, Mail,
    MessageSquare,
    Phone, TrendingUp
} from "lucide-react";
import { useState } from "react";

interface CustomerServiceActionsProps {
  user: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    phoneNumber: string | null;
  };
  order: {
    id: string;
    status: string;
  };
}

export default function CustomerServiceActions({ user, order }: CustomerServiceActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} kopioitu leikepöydälle` });
    } catch (error) {
      toast({ 
        title: "Virhe", 
        description: "Kopiointi epäonnistui",
        variant: "destructive"
      });
    }
  };

  const generateCustomerSummary = () => {
    return `
ASIAKKAAN YHTEENVETO
-------------------
Nimi: ${user.firstname} ${user.lastname}
ID: ${user.id}
Sähköposti: ${user.email}
Puhelin: ${user.phoneNumber || "Ei saatavilla"}

TILAUKSEN TIEDOT
---------------
Tilaus ID: ${order.id}
Tila: ${order.status}
Luotu: ${new Date().toLocaleDateString('fi-FI')}

HUOMIOT
-------
• ${order.status === "pending" ? "Odottaa urakoitsijan vastausta" : 
      order.status === "accepted" ? "Urakoitsija hyväksytty, valmistele aikataulu" : 
      order.status === "waitingForPayment" ? "Maksu odottaa vahvistusta" : 
      order.status === "done" ? "Työ valmistunut, pyydä palautetta" : 
      "Tila vaatii huomiota"}
    `.trim();
  };

  const handleAction = async (action: string) => {
    setLoading(action);
    try {
      switch (action) {
        case "call":
          if (user.phoneNumber) {
            window.open(`tel:${user.phoneNumber}`, '_blank');
          } else {
            toast({ 
              title: "Virhe", 
              description: "Puhelinnumeroa ei ole saatavilla",
              variant: "destructive"
            });
          }
          break;
        case "email":
          const subject = encodeURIComponent(`Tilaus ${order.id} - Tuki`);
          const body = encodeURIComponent(`Hei ${user.firstname || 'asiakas'},

Olemme yhteydessä tilauksesi ${order.id} osalta.

Tilauksen tila: ${order.status}

Miten voimme auttaa?

Ystävällisin terveisin,
Fiksaten tuki`);
          window.open(`mailto:${user.email}?subject=${subject}&body=${body}`, '_blank');
          break;
        case "copy-order-id":
          await copyToClipboard(order.id, "Tilaus ID");
          break;
        case "copy-user-id":
          await copyToClipboard(user.id, "Asiakas ID");
          break;
        case "copy-email":
          await copyToClipboard(user.email, "Sähköpostiosoite");
          break;
        case "copy-phone":
          if (user.phoneNumber) {
            await copyToClipboard(user.phoneNumber, "Puhelinnumero");
          } else {
            toast({ 
              title: "Virhe", 
              description: "Puhelinnumeroa ei ole saatavilla",
              variant: "destructive"
            });
          }
          break;
        case "copy-summary":
          await copyToClipboard(generateCustomerSummary(), "Asiakkaan yhteenveto");
          break;

      }
    } catch (error) {
      toast({ 
        title: "Virhe", 
        description: "Toiminto epäonnistui",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Communication Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Asiakasyhteydenotot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => handleAction("call")}
              disabled={loading === "call" || !user.phoneNumber}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              {loading === "call" ? "Soitetaan..." : "Soita"}
            </Button>
            <Button
              onClick={() => handleAction("email")}
              disabled={loading === "email"}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              {loading === "email" ? "Avataan..." : "Sähköposti"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Asiakastiedot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Nimi:</span>
              <span className="text-sm font-medium">{user.firstname} {user.lastname}</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sähköposti:</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Puhelin:</span>
              <span className="text-sm font-medium">{user.phoneNumber || "Ei saatavilla"}</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tila:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <Badge variant="secondary" className="text-xs">
                  {order.status === "pending" && "Odottaa"}
                  {order.status === "accepted" && "Hyväksytty"}
                  {order.status === "declined" && "Hylätty"}
                  {order.status === "waitingForPayment" && "Odottaa maksua"}
                  {order.status === "done" && "Valmis"}
                  {order.status === "expired" && "Vanhentunut"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-orange-600" />
            Nopeat toiminnot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("copy-order-id")}
              disabled={loading === "copy-order-id"}
            >
              <Copy className="h-3 w-3 mr-1" />
              Tilaus ID
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("copy-user-id")}
              disabled={loading === "copy-user-id"}
            >
              <Copy className="h-3 w-3 mr-1" />
              Asiakas ID
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("copy-email")}
              disabled={loading === "copy-email"}
            >
              <Copy className="h-3 w-3 mr-1" />
              Sähköposti
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("copy-phone")}
              disabled={loading === "copy-phone" || !user.phoneNumber}
            >
              <Copy className="h-3 w-3 mr-1" />
              Puhelin
            </Button>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleAction("copy-summary")}
            disabled={loading === "copy-summary"}
          >
            <FileText className="h-4 w-4 mr-2" />
            Kopioi yhteenveto
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-indigo-600" />
            Navigoi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Asiakkaan profiili
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(`/admin/orders?search=${user.id}`, '_blank')}
          >
            <History className="h-4 w-4 mr-2" />
            Tilaushistoria
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
