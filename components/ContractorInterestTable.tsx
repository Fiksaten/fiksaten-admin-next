"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import type {
  ContractorFilters,
  ContractorStats,
  InterestedContractor,
} from "@/app/lib/types/interestedContractors";
import { cn } from "@/app/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Filter,
  Globe,
  Mail,
  MailCheck,
  MailX,
  Search,
  Send,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { EmailStatusBadge } from "./EmailStatusBadge";

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
  stats?: ContractorStats | null;
  isStatsLoading?: boolean;
}

export const ContractorInterestTable: React.FC<
  ContractorInterestTableProps
> = ({
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
  stats,
  isStatsLoading = false,
}) => {
  // Use passed stats or fallback to calculated stats for backward compatibility
  const displayStats = stats || {
    total: totalContractors,
    emailSent: contractors.filter((c) => c.welcomeEmailSent).length,
    emailNotSent: contractors.filter(
      (c) => !c.welcomeEmailSent && !c.welcomeEmailError
    ).length,
    emailFailed: contractors.filter(
      (c) => !c.welcomeEmailSent && c.welcomeEmailError
    ).length,
    recentlyAdded: contractors.filter((c) => {
      const createdAt = new Date(c.createdAt);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdAt > dayAgo;
    }).length,
    waitingForResponse: contractors.filter(
      (c) => c.status === "waitingForResponse"
    ).length,
    interested: contractors.filter((c) => c.status === "interested").length,
    notInterested: contractors.filter((c) => c.status === "notInterested")
      .length,
    registered: contractors.filter((c) => c.status === "registered").length,
    assigned: contractors.filter((c) => c.assignedAdminId).length,
    unassigned: contractors.filter((c) => !c.assignedAdminId).length,
  };

  const handleFilterChange = (key: keyof ContractorFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const applyFilters = () => {
    // Filters are applied automatically through the hook
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      emailStatus: "all",
      status: "all",
      assignedAdmin: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waitingForResponse: {
        variant: "secondary" as const,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      interested: {
        variant: "default" as const,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      notInterested: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      registered: {
        variant: "outline" as const,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.waitingForResponse;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MM/dd/yyyy");
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const handlePasswordConfirm = () => {
    if (password === "sekoiluonlopetettu") {
      setPasswordError("");
      setPassword("");
      setShowPasswordDialog(false);
      onSendWelcomeEmails();
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const handleDialogClose = () => {
    setPassword("");
    setPasswordError("");
    setShowPasswordDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold">
                  {isStatsLoading ? "..." : displayStats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Sent
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isStatsLoading ? "..." : displayStats.emailSent}
                </p>
              </div>
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Not Sent
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {isStatsLoading ? "..." : displayStats.emailNotSent}
                </p>
              </div>
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Failed
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {isStatsLoading ? "..." : displayStats.emailFailed}
                </p>
              </div>
              <MailX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isStatsLoading ? "..." : displayStats.assigned}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Recent
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {isStatsLoading ? "..." : displayStats.recentlyAdded}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Waiting
                </p>
                <p className="text-xl font-bold text-yellow-600">
                  {isStatsLoading ? "..." : displayStats.waitingForResponse}
                </p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Interested
                </p>
                <p className="text-xl font-bold text-green-600">
                  {isStatsLoading ? "..." : displayStats.interested}
                </p>
              </div>
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Not Interested
                </p>
                <p className="text-xl font-bold text-red-600">
                  {isStatsLoading ? "..." : displayStats.notInterested}
                </p>
              </div>
              <Users className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Registered
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {isStatsLoading ? "..." : displayStats.registered}
                </p>
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
            <AlertDialog
              open={showPasswordDialog}
              onOpenChange={setShowPasswordDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => setShowPasswordDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Welcome Emails
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Confirm Welcome Email Sending
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="space-y-3">
                      <p className="text-red-600 font-medium">
                        ⚠️ WARNING: You are about to send welcome emails to{" "}
                        {displayStats.emailNotSent} contractors.
                      </p>
                      <p>
                        This action will send welcome emails to all contractors
                        who haven&apos;t received them yet. Please enter the
                        confirmation password to proceed.
                      </p>
                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Confirmation Password:
                        </label>
                        <Input
                          id="welcome-email-password"
                          name="welcome-email-password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError("");
                          }}
                          placeholder="Enter password"
                          className={passwordError ? "border-red-500" : ""}
                          autoComplete="new-password"
                          autoCorrect="off"
                          autoCapitalize="off"
                          data-form-type="other"
                          data-lpignore="true"
                        />
                        {passwordError && (
                          <p className="text-sm text-red-600">
                            {passwordError}
                          </p>
                        )}
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleDialogClose}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handlePasswordConfirm}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Send Welcome Emails
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={filters.search}
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.emailStatus}
              onValueChange={(value) =>
                handleFilterChange("emailStatus", value)
              }
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
                <SelectItem value="waitingForResponse">
                  Waiting for Response
                </SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="notInterested">Not Interested</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.assignedAdmin}
              onValueChange={(value) =>
                handleFilterChange("assignedAdmin", value)
              }
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
          </div>

          {/* Date Range and Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Date From */}
            <div>
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom
                      ? format(filters.dateFrom, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div>
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo
                      ? format(filters.dateTo, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="emailStatus">Email Status</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortOrder || "desc"}
              onValueChange={(value) => handleFilterChange("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
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

          {/* Filter Actions */}
          <div className="flex gap-2">
            <Button onClick={applyFilters} disabled={isLoading}>
              Apply Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              disabled={isLoading}
            >
              Clear Filters
            </Button>
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
                    {contractors.map((contractor) => (
                      <TableRow
                        key={contractor.id}
                        className={cn(
                          "hover:bg-muted/50",
                          contractor.welcomeEmailError &&
                            "border-l-4 border-l-red-500"
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
                            <div className="font-mono text-sm">
                              {contractor.email}
                            </div>
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
                                <span className="font-mono">
                                  {contractor.businessId}
                                </span>
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
                              <span className="text-sm text-muted-foreground">
                                No business details
                              </span>
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
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700"
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assigned
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-gray-50 text-gray-600"
                              >
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

              {contractors.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No contractors found matching your criteria.</p>
                </div>
              )}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalContractors)} of{" "}
                    {totalContractors} contractors
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = Math.max(1, currentPage - 2) + i;
                          if (pageNum > totalPages) return null;
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pageNum === currentPage ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => onPageChange(pageNum)}
                              disabled={isLoading}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || isLoading}
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
