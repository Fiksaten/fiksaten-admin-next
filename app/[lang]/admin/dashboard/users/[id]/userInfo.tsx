import { User } from "../users-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface InfoRowProps {
  label: string;
  value: string | number | boolean;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="py-2">
    <h3 className="font-medium text-gray-700">{label}</h3>
    <p className="text-gray-600">
      {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
    </p>
  </div>
);

const UserInfo = ({ userData }: { userData: User }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userData?.avatar} alt={`${userData?.firstname} ${userData?.lastname}`} />
          <AvatarFallback>{userData?.firstname[0]}{userData?.lastname[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userData.firstname} {userData.lastname}
          </h1>
          <Badge variant={userData.role === 'admin' ? 'destructive' : 'default'}>
            {userData.role}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-5 text-left">
          <TabsTrigger className="text-left" value="contact">Contact</TabsTrigger>
          <TabsTrigger className="text-left" value="address">Address</TabsTrigger>
          <TabsTrigger className="text-left" value="account">Account</TabsTrigger>
          <TabsTrigger className="text-left" value="preferences">Preferences</TabsTrigger>
          <TabsTrigger className="text-left" value="badges">Badges</TabsTrigger>
        </TabsList>

        <div className="mt-6 h-96 text-left">
          <TabsContent value="contact" className="space-y-1">
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoRow label="Email" value={userData.email} />
              <InfoRow label="Phone" value={userData.phoneNumber} />
            </CardContent>
          </TabsContent>

          <TabsContent value="address">
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoRow label="Street" value={userData.addressStreet} />
              <InfoRow label="Detail" value={userData.addressDetail} />
              <InfoRow label="ZIP Code" value={userData.addressZip} />
              <InfoRow label="Country" value={userData.addressCountry} />
            </CardContent>
          </TabsContent>

          <TabsContent value="account">
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoRow label="User ID" value={userData.id} />
              <InfoRow label="Role" value={userData.role} />
              <InfoRow 
                label="Created" 
                value={new Date(userData.created_at).toLocaleDateString()} 
              />
              <InfoRow 
                label="Last Updated" 
                value={new Date(userData.updated_at).toLocaleDateString()} 
              />
            </CardContent>
          </TabsContent>

          <TabsContent value="preferences">
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoRow 
                label="Push Notifications" 
                value={userData.pushNotificationPermission} 
              />
              <InfoRow 
                label="SMS" 
                value={userData.smsPersmission} 
              />
              <InfoRow 
                label="Email Notifications" 
                value={userData.emailPermission} 
              />
            </CardContent>
          </TabsContent>

          <TabsContent value="badges">
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoRow label="Offers" value={userData.badgeCountOffers} />
              <InfoRow label="Messages" value={userData.badgeCountMessages} />
            </CardContent>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default UserInfo;