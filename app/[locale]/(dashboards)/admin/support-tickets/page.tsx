import { getSupportTickets } from "@/app/lib/services/supportTicketService";
import { getaccessToken } from "@/app/lib/actions";
import SupportTicketsContainer from "./SupportTicketsContainer";

export default async function SupportTicketsPage() {
  const accessToken = await getaccessToken();
  const tickets = await getSupportTickets(accessToken);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to customer support tickets with enhanced filtering and assignment capabilities
        </p>
      </div>
      <SupportTicketsContainer initialTickets={tickets} accessToken={accessToken} />
    </div>
  );
}
