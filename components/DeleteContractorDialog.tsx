"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import type { InterestedContractor } from "@/app/lib/types/interestedContractors";
import { AlertTriangle, Mail, MailCheck, MailX, Trash2 } from "lucide-react";

interface DeleteContractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: InterestedContractor | null;
  onSuccess: () => void;
  accessToken: string;
}

export const DeleteContractorDialog: React.FC<DeleteContractorDialogProps> = ({
  open,
  onOpenChange,
  contractor,
  onSuccess,
  accessToken,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!contractor) return;

    setIsDeleting(true);
    try {
      await InterestedContractorsService.deleteContractor(contractor.id, accessToken);
      
      toast({
        title: "Contractor deleted",
        description: `${contractor.name} has been successfully removed from the system.`,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error deleting contractor",
        description: error instanceof Error ? error.message : "Failed to delete contractor",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const getEmailStatusBadge = (contractor: InterestedContractor) => {
    if (contractor.welcomeEmailSent) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <MailCheck className="w-3 h-3 mr-1" />
          Sent
        </Badge>
      );
    } else if (contractor.welcomeEmailError) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <MailX className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Mail className="w-3 h-3 mr-1" />
          Not Sent
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!contractor) return null;

  const hasReceivedEmail = contractor.welcomeEmailSent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete Contractor
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contractor? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contractor Information */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="font-medium">{contractor.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-mono text-sm">{contractor.email}</p>
            </div>
            
            {contractor.phoneNumber && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{contractor.phoneNumber}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Status</label>
              <div className="mt-1">
                {getEmailStatusBadge(contractor)}
              </div>
            </div>
            
            {contractor.welcomeEmailSentAt && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Sent At</label>
                <p className="text-sm">{formatDate(contractor.welcomeEmailSentAt)}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Registered</label>
              <p className="text-sm">{formatDate(contractor.createdAt)}</p>
            </div>
            
            {contractor.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm">{contractor.notes}</p>
              </div>
            )}
          </div>

          {/* Warning for contractors who have received welcome emails */}
          {hasReceivedEmail && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Warning: Email Already Sent
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This contractor has already received a welcome email. Deleting them will remove 
                    all records, but they may have already started the onboarding process.
                  </p>
                  {contractor.welcomeEmailSentAt && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                      Email sent on {formatDate(contractor.welcomeEmailSentAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Contractor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};