"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import { AdminService, Admin } from "@/app/lib/services/adminService";
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
  businessId: z.string().optional(),
  website: z.string().optional(),
  status: z.enum(["waitingForResponse", "interested", "notInterested", "registered"]).optional(),
  notes: z.string().optional(),
  assignedAdminId: z.union([z.uuid(), z.literal("none")]).optional(),
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
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<EditContractorFormData>({
    resolver: zodResolver(editContractorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      businessId: "",
      website: "",
      status: "waitingForResponse",
      notes: "",
      assignedAdminId: "none",
    },
  });

  // Watch email field to detect changes
  const watchedEmail = watch("email");

  const loadAdmins = useCallback(async () => {
    setIsLoadingAdmins(true);
    try {
      const adminList = await AdminService.getAllAdmins(accessToken);
      setAdmins(adminList);
    } catch (error) {
      console.error("Error loading admins:", error);
      toast({
        title: "Warning",
        description: "Failed to load admin list. Admin assignment will not be available.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAdmins(false);
    }
  }, [accessToken, toast]);

  // Load admins when dialog opens
  useEffect(() => {
    if (open && admins.length === 0) {
      loadAdmins();
    }
  }, [open, admins.length, loadAdmins]);

  // Update form when contractor changes
  useEffect(() => {
    if (contractor && open) {
      reset({
        name: contractor.name,
        email: contractor.email,
        phoneNumber: contractor.phoneNumber || "",
        businessId: contractor.businessId || "",
        website: contractor.website || "",
        status: contractor.status,
        notes: contractor.notes || "",
        assignedAdminId: contractor.assignedAdminId || "none",
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

      if ((data.businessId?.trim() || null) !== contractor.businessId) {
        requestData.businessId = data.businessId?.trim() || undefined;
      }

      if ((data.website?.trim() || null) !== contractor.website) {
        requestData.website = data.website?.trim() || undefined;
      }

      if (data.status !== contractor.status) {
        requestData.status = data.status;
      }

      if ((data.notes?.trim() || null) !== contractor.notes) {
        requestData.notes = data.notes?.trim() || undefined;
      }

      if (data.assignedAdminId !== (contractor.assignedAdminId || "none")) {
        requestData.assignedAdminId = data.assignedAdminId === "none" ? undefined : data.assignedAdminId;
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              placeholder="Enter contractor's phone number (optional)"
              registration={register("phoneNumber")}
              error={errors.phoneNumber?.message}
              disabled={isSubmitting}
            />

            <FormInput
              id="businessId"
              label="Business ID"
              placeholder="Enter business ID (optional)"
              registration={register("businessId")}
              error={errors.businessId?.message}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="website"
              label="Website"
              type="url"
              placeholder="Enter website URL (optional)"
              registration={register("website")}
              error={errors.website?.message}
              disabled={isSubmitting}
            />

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as EditContractorFormData["status"])
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waitingForResponse">Waiting for Response</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="notInterested">Not Interested</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedAdminId">Assigned Admin (Optional)</Label>
            <Select
              value={watch("assignedAdminId") || "none"}
              onValueChange={(value) => setValue("assignedAdminId", value === "none" ? "" : value)}
              disabled={isSubmitting || isLoadingAdmins}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select admin to assign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Admin Assigned</SelectItem>
                {admins.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    {(admin.firstname || '')} {(admin.lastname || '')} ({admin.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignedAdminId && (
              <p className="text-sm text-destructive">{errors.assignedAdminId.message}</p>
            )}
          </div>

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
