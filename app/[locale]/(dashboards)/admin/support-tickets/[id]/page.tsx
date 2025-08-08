import { getSupportTicket } from "@/app/lib/services/supportTicketService";
import { getaccessToken } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import TicketDetailContainer from "./TicketDetailContainer";

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const accessToken = await getaccessToken();

  try {
    const ticket = await getSupportTicket(accessToken, (await params).id);

    return (
      <div className="container mx-auto py-6">
        <TicketDetailContainer ticket={ticket} accessToken={accessToken} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
