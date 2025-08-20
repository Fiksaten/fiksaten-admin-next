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
import type { CreateContractorRequest } from "@/app/lib/types/interestedContractors";

const addContractorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  email: z.email("Please enter a valid email address"),
  phoneNumber: z.string().optional().refine((val) => {
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

type AddContractorFormData = z.infer<typeof addContractorSchema>;

interface AddContractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  accessToken: string;
}

export const AddContractorDialog: React.FC<AddContractorDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  accessToken,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    watch,
  } = useForm<AddContractorFormData>({
    resolver: zodResolver(addContractorSchema),
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        name: "",
        email: "",
        phoneNumber: "",
        businessId: "",
        website: "",
        status: "waitingForResponse",
        notes: "",
        assignedAdminId: "none",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: AddContractorFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the request data
      const requestData: CreateContractorRequest = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber?.trim() || undefined,
        businessId: data.businessId?.trim() || undefined,
        website: data.website?.trim() || undefined,
        status: data.status || "waitingForResponse",
        notes: data.notes?.trim() || undefined,
        assignedAdminId: data.assignedAdminId === "none" ? undefined : data.assignedAdminId,
      };

      await InterestedContractorsService.createContractor(requestData, accessToken);

      toast({
        title: "Contractor added successfully",
        description: `${data.name} has been added to the interested contractors list.`,
      });

      // Reset form and close dialog
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding contractor:", error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("duplicate") || error.message.includes("already exists")) {
          setError("email", {
            type: "manual",
            message: "A contractor with this email already exists",
          });
        } else {
          toast({
            title: "Error adding contractor",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error adding contractor",
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
      reset({
        name: "",
        email: "",
        phoneNumber: "",
        businessId: "",
        website: "",
        status: "waitingForResponse",
        notes: "",
        assignedAdminId: "none",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contractor</DialogTitle>
          <DialogDescription>
            Add a new contractor to the interested contractors list. They will be able to receive welcome emails.
          </DialogDescription>
        </DialogHeader>

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
              label="Phone Number (+358XXX)"
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
                  setValue("status", value as AddContractorFormData["status"])
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
              {isSubmitting ? "Adding..." : "Add Contractor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};