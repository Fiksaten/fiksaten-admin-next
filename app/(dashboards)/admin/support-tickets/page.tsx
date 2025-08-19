import { getSupportTickets } from "@/app/lib/services/supportTicketService";
import { AdminService } from "@/app/lib/services/adminService";
import { getaccessToken } from "@/app/lib/actions";
import SupportTicketsContainer from "./SupportTicketsContainer";

export default async function SupportTicketsPage() {
  const accessToken = await getaccessToken();
  const [tickets, admins] = await Promise.all([
    getSupportTickets(accessToken),
    AdminService.getAllAdmins(accessToken)
  ]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to customer support tickets with enhanced filtering and assignment capabilities
        </p>
      </div>
      <SupportTicketsContainer ticketsResponse={tickets} admins={admins} />
    </div>
  );
}
