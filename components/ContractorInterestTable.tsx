"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailCheck,
  MailX,
  Users,
  UserPlus,
  Clock,
  Edit,
  Trash2,
  Send,
  Building2,
  Globe,
  UserCheck,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { EmailStatusBadge } from "./EmailStatusBadge";
import type {
  InterestedContractor,
  ContractorFilters,
} from "@/app/lib/types/interestedContractors";

interface ContractorInterestTableProps {
  contractors: InterestedContractor[];
  filters: ContractorFilters;
  onFilterChange: (filters: ContractorFilters) => void;
  onContractorEdit: (contractor: InterestedContractor) => void;
  onContractorDelete: (contractor: InterestedContractor) => void;
  onSendWelcomeEmails: () => void;
  onRetryWelcomeEmail: (contractorId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  totalContractors: number;
  retryingEmails?: Set<string>;
}

export const ContractorInterestTable: React.FC<ContractorInterestTableProps> = ({
  contractors,
  filters,
  onFilterChange,
  onContractorEdit,
  onContractorDelete,
  onSendWelcomeEmails,
  onRetryWelcomeEmail,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  isLoading = false,
  totalContractors,
  retryingEmails = new Set(),
}) => {
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "name" | "email_status" | "status"
  >("newest");

  // Statistics for dashboard overview
  const stats = useMemo(() => {
    const total = totalContractors;
    const emailSent = contractors.filter((c) => c.welcomeEmailSent).length;
    const emailNotSent = contractors.filter((c) => !c.welcomeEmailSent && !c.welcomeEmailError).length;
    const emailFailed = contractors.filter((c) => !c.welcomeEmailSent && c.welcomeEmailError).length;
    const recentlyAdded = contractors.filter((c) => {
      const createdAt = new Date(c.createdAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdAt > dayAgo;
    }).length;

    // Status-based statistics
    const waitingForResponse = contractors.filter((c) => c.status === "waitingForResponse").length;
    const interested = contractors.filter((c) => c.status === "interested").length;
    const notInterested = contractors.filter((c) => c.status === "notInterested").length;
    const registered = contractors.filter((c) => c.status === "registered").length;
    const assigned = contractors.filter((c) => c.assignedAdminId).length;
    const unassigned = contractors.filter((c) => !c.assignedAdminId).length;

    return { 
      total, 
      emailSent, 
      emailNotSent, 
      emailFailed, 
      recentlyAdded,
      waitingForResponse,
      interested,
      notInterested,
      registered,
      assigned,
      unassigned
    };
  }, [contractors, totalContractors]);

  // Sort contractors based on selected criteria
  const sortedContractors = useMemo(() => {
    return [...contractors].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "email_status":
          // Sort by email status: failed, not sent, sent
          const getStatusPriority = (contractor: InterestedContractor) => {
            if (!contractor.welcomeEmailSent && contractor.welcomeEmailError) return 3; // Failed
            if (!contractor.welcomeEmailSent) return 2; // Not sent
            return 1; // Sent
          };
          return getStatusPriority(b) - getStatusPriority(a);
        case "status":
          // Sort by business status
          const statusOrder = { waitingForResponse: 1, interested: 2, notInterested: 3, registered: 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  }, [contractors, sortBy]);

  const handleFilterChange = (key: keyof ContractorFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waitingForResponse: {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      interested: {
        variant: "default" as const,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      notInterested: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      registered: {
        variant: "outline" as const,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.waitingForResponse;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Sent</p>
                <p className="text-2xl font-bold text-green-600">{stats.emailSent}</p>
              </div>
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Not Sent</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.emailNotSent}</p>
              </div>
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.emailFailed}</p>
              </div>
              <MailX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent</p>
                <p className="text-2xl font-bold text-purple-600">{stats.recentlyAdded}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Waiting</p>
                <p className="text-xl font-bold text-yellow-600">{stats.waitingForResponse}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interested</p>
                <p className="text-xl font-bold text-green-600">{stats.interested}</p>
              </div>
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Not Interested</p>
                <p className="text-xl font-bold text-red-600">{stats.notInterested}</p>
              </div>
              <Users className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered</p>
                <p className="text-xl font-bold text-blue-600">{stats.registered}</p>
              </div>
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <Button onClick={onSendWelcomeEmails} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Welcome Emails
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.emailStatus}
              onValueChange={(value) => handleFilterChange("emailStatus", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Email Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Email Status</SelectItem>
                <SelectItem value="sent">Email Sent</SelectItem>
                <SelectItem value="not_sent">Not Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waitingForResponse">Waiting for Response</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="notInterested">Not Interested</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.assignedAdmin}
              onValueChange={(value) => handleFilterChange("assignedAdmin", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Admins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: string) => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="email_status">Email Status</SelectItem>
                <SelectItem value="status">Business Status</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Page Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contractors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Interested Contractors</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Business Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Email Status</TableHead>
                      <TableHead>Assigned Admin</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedContractors.map((contractor) => (
                      <TableRow
                        key={contractor.id}
                        className={cn(
                          "hover:bg-muted/50",
                          contractor.welcomeEmailError && "border-l-4 border-l-red-500"
                        )}
                      >
                        <TableCell>
                          <div className="font-medium">{contractor.name}</div>
                          {contractor.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {contractor.notes.length > 50
                                ? `${contractor.notes.substring(0, 50)}...`
                                : contractor.notes}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-mono text-sm">{contractor.email}</div>
                            {contractor.phoneNumber && (
                              <div className="text-sm text-muted-foreground">
                                {contractor.phoneNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {contractor.businessId && (
                              <div className="flex items-center gap-1 text-sm">
                                <Building2 className="h-3 w-3" />
                                <span className="font-mono">{contractor.businessId}</span>
                              </div>
                            )}
                            {contractor.website && (
                              <div className="flex items-center gap-1 text-sm">
                                <Globe className="h-3 w-3" />
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  {contractor.website}
                                </span>
                              </div>
                            )}
                            {!contractor.businessId && !contractor.website && (
                              <span className="text-sm text-muted-foreground">No business details</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contractor.status)}
                        </TableCell>
                        <TableCell>
                          <EmailStatusBadge
                            contractor={contractor}
                            onRetry={onRetryWelcomeEmail}
                            isRetrying={retryingEmails.has(contractor.id)}
                            showRetryButton={true}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {contractor.assignedAdminId ? (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assigned
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-50 text-gray-600">
                                Unassigned
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatRelativeTime(contractor.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onContractorEdit(contractor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onContractorDelete(contractor)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {sortedContractors.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No contractors found matching your criteria.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({stats.total} total contractors)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};