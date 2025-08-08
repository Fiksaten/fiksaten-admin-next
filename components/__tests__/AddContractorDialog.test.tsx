import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { AddContractorDialog } from "../AddContractorDialog";
import { InterestedContractorsService } from "@/app/lib/services/interestedContractors";

// Mock the service
vi.mock("@/app/lib/services/interestedContractors", () => ({
  InterestedContractorsService: {
    createContractor: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("AddContractorDialog", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when open", () => {
    render(
      <AddContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    expect(screen.getByText("Add New Contractor")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address *")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <AddContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const submitButton = screen.getByText("Add Contractor");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(
      <AddContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const nameInput = screen.getByLabelText("Full Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    const submitButton = screen.getByText("Add Contractor");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const mockCreateContractor = vi.mocked(InterestedContractorsService.createContractor);
    mockCreateContractor.mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
      welcomeEmailSent: false,
      welcomeEmailSentAt: null,
      welcomeEmailError: null,
      notes: "Test notes",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(
      <AddContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const nameInput = screen.getByLabelText("Full Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    const phoneInput = screen.getByLabelText("Phone Number");
    const notesInput = screen.getByLabelText("Notes");
    const submitButton = screen.getByText("Add Contractor");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "+1234567890" } });
    fireEvent.change(notesInput, { target: { value: "Test notes" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateContractor).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "+1234567890",
        notes: "Test notes",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("handles API errors", async () => {
    const mockCreateContractor = vi.mocked(InterestedContractorsService.createContractor);
    mockCreateContractor.mockRejectedValue(new Error("Email already exists"));

    render(
      <AddContractorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
        accessToken="test-token"
      />
    );

    const nameInput = screen.getByLabelText("Full Name *");
    const emailInput = screen.getByLabelText("Email Address *");
    const submitButton = screen.getByText("Add Contractor");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("A contractor with this email already exists")).toBeInTheDocument();
    });
  });
});