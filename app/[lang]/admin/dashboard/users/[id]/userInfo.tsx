import { User } from "../users-page";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const UserInfo = ({ userData }: { userData: User }) => {

    return (
        <div>
            <h1 className="text-3xl font-bold text-black">{userData.firstname} {userData.lastname}</h1>
            <div className="mt-4 space-y-4">
                <Accordion type="single" collapsible className="w-full text-black">
                    <AccordionItem value="contact-info">
                        <AccordionTrigger className="text-black text-xl font-bold">Contact Information</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-600">Email: {userData.email}</p>
                            <p className="text-gray-600">Phone: {userData.phoneNumber}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


                <Accordion type="single" collapsible className="w-full text-black">
                    <AccordionItem value="address">
                        <AccordionTrigger className="text-black text-xl font-bold">Address</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-600">{userData.addressStreet}</p>
                            <p className="text-gray-600">{userData.addressDetail}</p>
                            <p className="text-gray-600">{userData.addressZip}, {userData.addressCountry}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


                <Accordion type="single" collapsible className="w-full text-black">
                    <AccordionItem value="account-details">
                        <AccordionTrigger className="text-black text-xl font-bold">Account Details</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-600">User ID: {userData.id}</p>
                            <p className="text-gray-600">Role: {userData.role}</p>
                            <p className="text-gray-600">Created: {new Date(userData.created_at).toLocaleDateString()}</p>
                            <p className="text-gray-600">Last Updated: {new Date(userData.updated_at).toLocaleDateString()}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible className="w-full text-black">
                    <AccordionItem value="preferences">
                        <AccordionTrigger className="text-black text-xl font-bold">Preferences</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-600">Push Notifications: {userData.pushNotificationPermission ? 'Enabled' : 'Disabled'}</p>
                            <p className="text-gray-600">SMS: {userData.smsPersmission ? 'Enabled' : 'Disabled'}</p>
                            <p className="text-gray-600">Email: {userData.emailPermission ? 'Enabled' : 'Disabled'}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible className="w-full text-black">
                    <AccordionItem value="badges">
                        <AccordionTrigger className="text-black text-xl font-bold">Badges</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-600">Offers: {userData.badgeCountOffers}</p>
                            <p className="text-gray-600">Messages: {userData.badgeCountMessages}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

export default UserInfo;