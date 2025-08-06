import { render, screen } from '@testing-library/react';
import { ContractorInterestTable } from '../ContractorInterestTable';
import type { InterestedContractor } from '@/app/lib/types/interestedContractors';

// Mock data
const mockContractors: InterestedContractor[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    welcomeEmailSent: true,
    welcomeEmailSentAt: '2024-01-01T10:00:00Z',
    welcomeEmailError: null,
    notes: 'Test contractor',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: null,
    welcomeEmailSent: false,
    welcomeEmailSentAt: null,
    welcomeEmailError: 'Failed to send email',
    notes: null,
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-02T09:00:00Z',
  },
];

const mockProps = {
  contractors: mockContractors,
  filters: { search: '', emailStatus: 'all' },
  onFilterChange: jest.fn(),
  onContractorEdit: jest.fn(),
  onContractorDelete: jest.fn(),
  onSendWelcomeEmails: jest.fn(),
  currentPage: 1,
  totalPages: 1,
  onPageChange: jest.fn(),
  pageSize: 20,
  onPageSizeChange: jest.fn(),
  isLoading: false,
  totalContractors: 2,
};

describe('ContractorInterestTable', () => {
  it('renders contractor data correctly', () => {
    render(<ContractorInterestTable {...mockProps} />);
    
    // Check if contractor names are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Check if email addresses are displayed
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays email status badges correctly', () => {
    render(<ContractorInterestTable {...mockProps} />);
    
    // Should show "Sent" badge for first contractor
    expect(screen.getByText('Sent')).toBeInTheDocument();
    
    // Should show "Failed" badge for second contractor
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<ContractorInterestTable {...mockProps} isLoading={true} />);
    
    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('displays statistics correctly', () => {
    render(<ContractorInterestTable {...mockProps} />);
    
    // Should show total count
    expect(screen.getByText('2')).toBeInTheDocument(); // Total contractors
  });
});