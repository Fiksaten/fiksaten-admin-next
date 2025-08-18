import { resolveToken } from "./util";

interface TicketAnalysis {
  id: string;
  status: "pending" | "completed" | "failed";
  suggestions: Array<{
    id: string;
    answer: string;
    confidence: number;
    sources: Array<{ title: string; url: string }>;
    relatedInformation: Array<{ id: string; title: string; content: string }>;
    createdAt: string;
  }>;
}

const getTicketAnalysis = async (
  accessToken: string | undefined,
  ticketId: string
): Promise<TicketAnalysis> => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  const res = await fetch(`/api/support-tickets/${ticketId}/analysis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch analysis");
  return res.json();
};

const reEnqueueAnalysis = async (
  accessToken: string | undefined,
  analysisId: string
) => {
  const token = resolveToken(accessToken);
  if (!token) throw new Error("No access token available");
  await fetch(`/api/support-tickets/analysis/${analysisId}/retry`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { getTicketAnalysis, reEnqueueAnalysis };
export type { TicketAnalysis };
