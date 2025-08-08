"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextarea";
import { useToast } from "@/hooks/use-toast";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import type {
  InterestedContractor,
  UpdateContractorRequest,
} from "@/app/lib/types/interestedContractors";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Validation schema
const editContractorSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      // Basic phone validation - allows various formats
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ""));
    }, "Please enter a valid phone number"),
  notes: z.string().optional(),
});

type EditContractorFormData = z.infer<typeof editContractorSchema>;

interface EditContractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: InterestedContractor | null;
  onSuccess: () => void;
  accessToken: string;
}

export const EditContractorDialog: React.FC<EditContractorDialogProps> = ({
  open,
  onOpenChange,
  contractor,
  onSuccess,
  accessToken,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm<EditContractorFormData>({
    resolver: zodResolver(editContractorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      notes: "",
    },
  });

  // Watch email field to detect changes
  const watchedEmail = watch("email");

  // Update form when contractor changes
  useEffect(() => {
    if (contractor && open) {
      reset({
        name: contractor.name,
        email: contractor.email,
        phoneNumber: contractor.phoneNumber || "",
        notes: contractor.notes || "",
      });
      setEmailChanged(false);
    }
  }, [contractor, open, reset]);

  // Check if email has changed
  useEffect(() => {
    if (contractor && watchedEmail) {
      setEmailChanged(
        watchedEmail.toLowerCase() !== contractor.email.toLowerCase()
      );
    }
  }, [watchedEmail, contractor]);

  const onSubmit = async (data: EditContractorFormData) => {
    if (!contractor) return;

    setIsSubmitting(true);

    try {
      // Prepare the request data - only include changed fields
      const requestData: UpdateContractorRequest = {};

      if (data.name.trim() !== contractor.name) {
        requestData.name = data.name.trim();
      }

      if (data.email.trim().toLowerCase() !== contractor.email.toLowerCase()) {
        requestData.email = data.email.trim().toLowerCase();
      }

      if ((data.phoneNumber?.trim() || null) !== contractor.phoneNumber) {
        requestData.phoneNumber = data.phoneNumber?.trim() || undefined;
      }

      if ((data.notes?.trim() || null) !== contractor.notes) {
        requestData.notes = data.notes?.trim() || undefined;
      }

      // Only make API call if there are changes
      if (Object.keys(requestData).length === 0) {
        toast({
          title: "No changes detected",
          description: "No changes were made to the contractor information.",
        });
        onOpenChange(false);
        return;
      }

      await InterestedContractorsService.updateContractor(
        contractor.id,
        requestData,
        accessToken
      );

      let successMessage = `${data.name} has been updated successfully.`;
      if (emailChanged) {
        successMessage +=
          " The welcome email status has been reset due to email change.";
      }

      toast({
        title: "Contractor updated successfully",
        description: successMessage,
      });

      // Close dialog and refresh data
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating contractor:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (
          error.message.includes("duplicate") ||
          error.message.includes("already exists")
        ) {
          setError("email", {
            type: "manual",
            message: "A contractor with this email already exists",
          });
        } else {
          toast({
            title: "Error updating contractor",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error updating contractor",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmailChanged(false);
      onOpenChange(false);
    }
  };

  if (!contractor) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Contractor</DialogTitle>
          <DialogDescription>
            Update the contractor&apos;s information. Changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>

        {emailChanged && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Changing the email address will reset the welcome email status.
              The contractor will be eligible to receive a welcome email again.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="name"
            label="Full Name *"
            placeholder="Enter contractor's full name"
            registration={register("name")}
            error={errors.name?.message}
            disabled={isSubmitting}
          />

          <FormInput
            id="email"
            label="Email Address *"
            type="email"
            placeholder="Enter contractor's email address"
            registration={register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          <FormInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="Enter contractor's phone number (optional)"
            registration={register("phoneNumber")}
            error={errors.phoneNumber?.message}
            disabled={isSubmitting}
          />

          <FormTextarea
            id="notes"
            label="Notes"
            placeholder="Add any additional notes about this contractor (optional)"
            registration={register("notes")}
            error={errors.notes?.message}
            disabled={isSubmitting}
            rows={3}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Contractor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
