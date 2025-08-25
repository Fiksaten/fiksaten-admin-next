import { getSupportTicket } from "@/app/lib/services/supportTicketService";
import { getaccessToken } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import TicketDetailContainer from "./TicketDetailContainer";
import { getAllAdmins } from "@/app/lib/openapi-client";

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
    const admins = await getAllAdmins({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return (
      <div className="container mx-auto py-6">
        <TicketDetailContainer ticket={ticket} admins={admins.data || []} accessToken={accessToken} />
      </div>
    );
  } catch {
    notFound();
  }
}
