"use client";

import { useState } from "react";
import { ContractorInterestTable } from "./ContractorInterestTable";
import { AddContractorDialog } from "./AddContractorDialog";
import { EditContractorDialog } from "./EditContractorDialog";
import { DeleteContractorDialog } from "./DeleteContractorDialog";
import { EmailSendingProgressDialog } from "./EmailSendingProgressDialog";
import { useContractorInterest } from "@/hooks/useContractorInterest";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type {
  InterestedContractor,
  EmailSendingResult,
} from "@/app/lib/types/interestedContractors";

interface ContractorInterestDashboardProps {
  accessToken: string;
}

export const ContractorInterestDashboard: React.FC<ContractorInterestDashboardProps> = ({ accessToken }) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailProgressOpen, setEmailProgressOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<InterestedContractor | null>(null);
  const [emailSendingResult, setEmailSendingResult] =
    useState<EmailSendingResult | null>(null);
  const [emailSendingError, setEmailSendingError] = useState<string | null>(
    null
  );
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [retryingEmails, setRetryingEmails] = useState<Set<string>>(new Set());

  const {
    contractors,
    totalContractors,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    filters,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    refreshContractors,
    sendWelcomeEmails,
    retryWelcomeEmail,
  } = useContractorInterest({ accessToken });

  const handleContractorEdit = (contractor: InterestedContractor) => {
    setSelectedContractor(contractor);
    setEditDialogOpen(true);
  };

  const handleContractorDelete = (contractor: InterestedContractor) => {
    setSelectedContractor(contractor);
    setDeleteDialogOpen(true);
  };

  const handleAddContractor = () => {
    setAddDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    refreshContractors();
  };

  const handleSendWelcomeEmails = async () => {
    setIsEmailSending(true);
    setEmailSendingResult(null);
    setEmailSendingError(null);
    setEmailProgressOpen(true);

    const result = await sendWelcomeEmails();

    setIsEmailSending(false);

    if (result.success && result.result) {
      setEmailSendingResult(result.result);
      toast({
        title: "Welcome emails sent",
        description: `Successfully sent ${result.result.sent} emails. ${result.result.failed} failed.`,
      });
    } else {
      setEmailSendingError(result.error || "Failed to send welcome emails");
      toast({
        title: "Error sending emails",
        description: result.error || "Failed to send welcome emails",
        variant: "destructive",
      });
    }
  };

  const handleRetryWelcomeEmail = async (contractorId: string) => {
    setRetryingEmails((prev) => new Set(prev).add(contractorId));

    const result = await retryWelcomeEmail(contractorId);

    setRetryingEmails((prev) => {
      const newSet = new Set(prev);
      newSet.delete(contractorId);
      return newSet;
    });

    if (result.success && result.result) {
      toast({
        title: "Email retry successful",
        description:
          result.result.sent > 0
            ? "Welcome email sent successfully"
            : "Email retry failed",
        variant: result.result.sent > 0 ? "default" : "destructive",
      });
    } else {
      toast({
        title: "Email retry failed",
        description: result.error || "Failed to retry welcome email",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSuccess = async () => {
    await refreshContractors();
  };

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshContractors}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button
          onClick={handleAddContractor}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Contractor
        </Button>
      </div>

      {/* Main Table */}
      <ContractorInterestTable
        contractors={contractors}
        filters={filters}
        onFilterChange={handleFilterChange}
        onContractorEdit={handleContractorEdit}
        onContractorDelete={handleContractorDelete}
        onSendWelcomeEmails={handleSendWelcomeEmails}
        onRetryWelcomeEmail={handleRetryWelcomeEmail}
        retryingEmails={retryingEmails}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
        totalContractors={totalContractors}
      />

      {/* Add Contractor Dialog */}
      <AddContractorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleDialogSuccess}
        accessToken={accessToken}
      />

      {/* Edit Contractor Dialog */}
      <EditContractorDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        contractor={selectedContractor}
        onSuccess={handleDialogSuccess}
        accessToken={accessToken}
      />

      {/* Delete Contractor Dialog */}
      <DeleteContractorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        contractor={selectedContractor}
        onSuccess={handleDeleteSuccess}
        accessToken={accessToken}
      />

      {/* Email Sending Progress Dialog */}
      <EmailSendingProgressDialog
        open={emailProgressOpen}
        onOpenChange={setEmailProgressOpen}
        isLoading={isEmailSending}
        result={emailSendingResult}
        error={emailSendingError}
      />
    </div>
  );
};
