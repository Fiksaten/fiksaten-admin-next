import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { DeleteContractorDialog } from "../DeleteContractorDialog";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";
import type { InterestedContractor } from "@/app/lib/types/interestedContractors";

// Mock the service
vi.mock("@/app/lib/services/interestedContractors", () => ({
  InterestedContractorsService: {
    deleteContractor: vi.fn(),
  },
}));

// Mock the toast hook
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockContractor: InterestedContractor = {
  id: "test-id",
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

const mockContractorWithEmail: InterestedContractor = {
  ...mockContractor,
  welcomeEmailSent: true,
  welcomeEmailSentAt: "2024-01-02T00:00:00Z",
};

describe("DeleteContractorDialog", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when open with contractor data", () => {
    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
    expect(screen.getByText("Test notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete contractor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not render when contractor is null", () => {
    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={null}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.queryByText("Delete Contractor")).not.toBeInTheDocument();
  });

  it("shows warning when contractor has received welcome email", () => {
    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractorWithEmail}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByText("Warning: Email Already Sent")).toBeInTheDocument();
    expect(
      screen.getByText(/This contractor has already received a welcome email/)
    ).toBeInTheDocument();
  });

  it("does not show warning when contractor has not received welcome email", () => {
    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.queryByText("Warning: Email Already Sent")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when cancel button is clicked", () => {
    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("successfully deletes contractor and shows success toast", async () => {
    vi.mocked(InterestedContractorsService.deleteContractor).mockResolvedValue(undefined);

    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete contractor/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(InterestedContractorsService.deleteContractor).toHaveBeenCalledWith("test-id");
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Contractor deleted",
      description: "John Doe has been successfully removed from the system.",
    });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles delete error and shows error toast", async () => {
    const errorMessage = "Failed to delete contractor";
    vi.mocked(InterestedContractorsService.deleteContractor).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete contractor/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error deleting contractor",
        description: errorMessage,
        variant: "destructive",
      });
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("shows loading state during deletion", async () => {
    vi.mocked(InterestedContractorsService.deleteContractor).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete contractor/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("displays correct email status badges", () => {
    const contractorWithFailedEmail: InterestedContractor = {
      ...mockContractor,
      welcomeEmailError: "Email delivery failed",
    };

    const { rerender } = render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractor}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByText("Not Sent")).toBeInTheDocument();

    rerender(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractorWithEmail}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByText("Sent")).toBeInTheDocument();

    rerender(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={contractorWithFailedEmail}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    render(
      <DeleteContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        contractor={mockContractorWithEmail}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    // Check that dates are formatted (exact format may vary by locale)
    expect(screen.getAllByText(/2024/)).toHaveLength(3); // Registration date, email sent date, and warning text
  });
});