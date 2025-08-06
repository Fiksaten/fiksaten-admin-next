import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { EditContractorDialog } from "../EditContractorDialog";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import type { InterestedContractor } from "@/app/lib/types/interestedContractors";

// Mock the service
vi.mock("@/app/lib/services/interestedContractors", () => ({
  InterestedContractorsService: {
    updateContractor: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("EditContractorDialog", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  const mockContractor: InterestedContractor = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    welcomeEmailSent: false,
    welcomeEmailSentAt: null,
    welcomeEmailError: null,
    notes: "Test notes",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when open with contractor data", () => {
    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByText("Edit Contractor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test notes")).toBeInTheDocument();
  });

  it("shows email change warning when email is modified", async () => {
    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const emailInput = screen.getByLabelText("Email Address *");
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });

    await waitFor(() => {
      expect(screen.getByText(/Changing the email address will reset the welcome email status/)).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const nameInput = screen.getByLabelText("Full Name *");
    const submitButton = screen.getByText("Update Contractor");

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("submits form with changed data only", async () => {
    const mockUpdateContractor = vi.mocked(InterestedContractorsService.updateContractor);
    mockUpdateContractor.mockResolvedValue({
      ...mockContractor,
      name: "Jane Doe",
    });

    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const nameInput = screen.getByLabelText("Full Name *");
    const submitButton = screen.getByText("Update Contractor");

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateContractor).toHaveBeenCalledWith("1", {
        name: "Jane Doe",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("handles no changes scenario", async () => {
    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const submitButton = screen.getByText("Update Contractor");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("handles API errors", async () => {
    const mockUpdateContractor = vi.mocked(InterestedContractorsService.updateContractor);
    mockUpdateContractor.mockRejectedValue(new Error("Email already exists"));

    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const emailInput = screen.getByLabelText("Email Address *");
    const submitButton = screen.getByText("Update Contractor");

    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("A contractor with this email already exists")).toBeInTheDocument();
    });
  });

  it("does not render when contractor is null", () => {
    render(
      <EditContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={null}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.queryByText("Edit Contractor")).not.toBeInTheDocument();
  });
});