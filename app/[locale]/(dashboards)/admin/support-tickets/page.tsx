import { getSupportTickets } from "@/app/lib/services/supportTicketService";
import { getaccessToken } from "@/app/lib/actions";
import SupportTicketAdminTable from "./SupportTicketAdminTable";

export default async function SupportTicketsPage() {
  const accessToken = await getaccessToken();
  const tickets = await getSupportTickets(accessToken);

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground mt-1">
          Manage and respond to customer support tickets
        </p>
      </div>
      <SupportTicketAdminTable tickets={tickets} accessToken={accessToken} />
    </div>
  );
}
