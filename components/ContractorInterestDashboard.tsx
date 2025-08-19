"use client";

import { useState } from "react";
import { ContractorInterestTable } from "./ContractorInterestTable";

import { AddContractorDialog } from "../app/(dashboards)/admin/contractor-interest/AddContractorDialog";
import { EditContractorDialog } from "./EditContractorDialog";
import { DeleteContractorDialog } from "./DeleteContractorDialog";
import { EmailSendingProgressDialog } from "./EmailSendingProgressDialog";
import { useContractorInterest } from "@/hooks/useContractorInterest";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("table");

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

  const handleDeleteSuccess = () => {
    refreshContractors();
  };

  const handleSendWelcomeEmails = async () => {
    console.log("Sending welcome emails");
    console.log("Is email sending: ", isEmailSending);
    setIsEmailSending(true);
    setEmailProgressOpen(true);
    setEmailSendingError(null);

    try {
      console.log("Sending welcome emails");
      const result = await sendWelcomeEmails();
      if (result.success && result.result) {
        setEmailSendingResult(result.result);
        toast({
          title: "Welcome emails sent successfully",
          description: `Successfully sent ${result.result.sent} emails. ${
            result.result.failed && result.result.failed > 0 ? `${result.result.failed} failed.` : ""
          }`,
        });
      } else {
        setEmailSendingError(result.error || "Failed to send welcome emails");
        toast({
          title: "Error sending welcome emails",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setEmailSendingError(errorMessage);
      toast({
        title: "Error sending welcome emails",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleRetryWelcomeEmail = async (contractorId: string) => {
    setRetryingEmails((prev) => new Set(prev).add(contractorId));

    try {
      const result = await retryWelcomeEmail(contractorId);
      if (result.success) {
        toast({
          title: "Welcome email retried successfully",
          description: "The welcome email has been resent to the contractor.",
        });
        refreshContractors();
      } else {
        toast({
          title: "Error retrying welcome email",
          description: result.error || "Failed to retry welcome email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error retrying welcome email",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setRetryingEmails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contractorId);
        return newSet;
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">
            Error loading contractors
          </p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshContractors} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleAddContractor}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Contractor
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contractor Table
          </TabsTrigger>
        </TabsList>

        


        <TabsContent value="table" className="space-y-6">
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
        </TabsContent>
      </Tabs>

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
        result={emailSendingResult}
        error={emailSendingError}
        isLoading={isEmailSending}
      />
    </div>
  );
};
