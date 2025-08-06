"use client";

import React, { useState } from "react";
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
import type { CreateContractorRequest } from "@/app/lib/types/interestedContractors";

// Validation schema
const addContractorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ""));
  }, "Please enter a valid phone number"),
  notes: z.string().optional(),
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
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<AddContractorFormData>({
    resolver: zodResolver(addContractorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      notes: "",
    },
  });

  const onSubmit = async (data: AddContractorFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the request data
      const requestData: CreateContractorRequest = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
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
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contractor</DialogTitle>
          <DialogDescription>
            Add a new contractor to the interested contractors list. They will be able to receive welcome emails.
          </DialogDescription>
        </DialogHeader>

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
              {isSubmitting ? "Adding..." : "Add Contractor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};