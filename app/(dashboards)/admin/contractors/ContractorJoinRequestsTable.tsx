"use client";

import { useState } from "react";
import {
  approveContractor,
  declineContractor,
} from "@/app/lib/services/contractorService";
import { ContractorJoinRequests } from "@/app/lib/types/contractorTypes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type Props = {
  joinRequests: ContractorJoinRequests;
  accessToken: string;
};

export default function ContractorJoinRequestsTable({
  joinRequests,
  accessToken,
}: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [requests, setRequests] = useState(joinRequests);

  const handleAction = async (
    contractorId: string,
    action: "approve" | "decline"
  ) => {
    setLoadingId(contractorId);
    try {
      if (action === "approve") {
        await approveContractor(accessToken, contractorId);
        toast({
          title: "Approved",
          description: "Contractor approved successfully.",
        });
      } else {
        await declineContractor(accessToken, contractorId);
        toast({ title: "Declined", description: "Contractor declined." });
      }
      setRequests((prev) => prev.filter((c) => c.userId !== contractorId));
    } catch (e: unknown) {
      const error = e as Error;
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoadingId(null);
    }
  };

  if (!requests.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No join requests.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow p-4 dark:bg-card dark:border-muted">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Name</TableHead>
            <TableHead className="text-foreground">Email</TableHead>
            <TableHead className="text-foreground">Company</TableHead>
            <TableHead className="text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((contractor) => (
            <TableRow
              key={contractor.userId}
              className="hover:bg-muted/50 dark:hover:bg-muted"
            >
              <TableCell className="text-foreground">
                {contractor.name}
              </TableCell>
              <TableCell className="text-foreground">
                {contractor.email}
              </TableCell>
              <TableCell className="text-foreground">
                {contractor.name}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="mr-2"
                  disabled={loadingId === contractor.userId}
                  onClick={() => handleAction(contractor.userId, "approve")}
                  variant="default"
                >
                  {loadingId === contractor.userId ? "Approving..." : "Approve"}
                </Button>
                <Button
                  size="sm"
                  disabled={loadingId === contractor.userId}
                  onClick={() => handleAction(contractor.userId, "decline")}
                  variant="destructive"
                >
                  {loadingId === contractor.userId ? "Declining..." : "Decline"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
