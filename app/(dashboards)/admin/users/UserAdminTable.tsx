"use client";

import {
  GetAllUsersResponse,
  GetCurrentUserResponse as User,
} from "@/app/lib/openapi-client";
import {
  sendNotificationToAllConsumers,
  sendNotificationToAllContractors,
  sendNotificationToAllUsers,
  sendNotificationToUser,
} from "@/app/lib/services/notificationService";
import {
  getAllUsers,
  requestAccountDeletion,
  updateUser,
} from "@/app/lib/services/userService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  initialData: GetAllUsersResponse;
  accessToken: string;
}

type NotificationTarget = "user" | "all" | "consumers" | "contractors";

export default function UserAdminTable({ initialData, accessToken }: Props) {
  const [users, setUsers] = useState(initialData.users);
  const [pagination, setPagination] = useState({
    page: initialData.page || 1,
    limit: initialData.limit || 10,
    totalCount: initialData.totalCount,
    totalPages: initialData.totalPages || 1,
  });
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    role: "" as "" | "admin" | "contractor" | "consumer",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    sortBy: "createdAt" as "createdAt" | "email" | "firstname" | "lastname",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Load users for pagination
  const loadUsers = async (page: number, limit: number = pagination.limit) => {
    setLoading(true);
    try {
      const data = await getAllUsers(
        accessToken,
        limit,
        page,
        filters.search || undefined,
        filters.role || undefined,
        filters.dateFrom?.toISOString(),
        filters.dateTo?.toISOString(),
        filters.sortBy,
        filters.sortOrder
      );
      setUsers(data.users);
      setPagination({
        page: data.page || page,
        limit: data.limit || limit,
        totalCount: data.totalCount,
        totalPages: data.totalPages || 1,
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadUsers(newPage);
    }
  };

  // Filter handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadUsers(1); // Reset to first page when applying filters
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "" as "" | "admin" | "contractor" | "consumer",
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    // Load users without filters
    loadUsers(1);
  };

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "",
    target: "user" as NotificationTarget,
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingNotificationAction, setPendingNotificationAction] = useState<
    "bulk" | "individual" | null
  >(null);
  const [password, setPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({ ...user });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditUser(null);
    setForm({});
  };

  // Password verification implemented for bulk notifications

  const openNotification = (user?: User) => {
    if (user) {
      // Individual user notification - no password required
      setSelectedUser(user);
      setNotificationForm((prev) => ({ ...prev, target: "user" }));
      setNotificationOpen(true);
    } else {
      // Bulk notification - require password
      setPendingNotificationAction("bulk");
      setShowPasswordDialog(true);
    }
  };

  const closeNotificationDialog = () => {
    setNotificationOpen(false);
    setSelectedUser(null);
    setNotificationForm({
      title: "",
      message: "",
      type: "",
      target: "user",
    });
  };

  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
    setPendingNotificationAction(null);
    setPassword("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      // Here you would typically verify the password with your backend
      // For now, we'll use a simple check (you should replace this with actual verification)
      if (password !== "admin123") {
        throw new Error("Invalid password");
      }

      // Password is correct, proceed with the notification
      if (pendingNotificationAction === "bulk") {
        setNotificationForm((prev) => ({ ...prev, target: "all" }));
        setNotificationOpen(true);
      } else if (pendingNotificationAction === "individual" && selectedUser) {
        setNotificationForm((prev) => ({ ...prev, target: "user" }));
        setNotificationOpen(true);
      }

      closePasswordDialog();
      toast({
        title: "Success",
        description: "Password verified. You can now send the notification.",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNotificationForm({
      ...notificationForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setLoading(true);
    try {
      await updateUser(accessToken, {
        ...form,
        email: form.email || "",
      });
      // Refresh current page to show updated data
      await loadUsers(pagination.page);
      toast({ title: "User updated" });
      closeDialog();
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationForm.title || !notificationForm.message) {
      toast({
        title: "Error",
        description: "Title and message are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const notificationData = {
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type || undefined,
      };

      let response;
      switch (notificationForm.target) {
        case "user":
          if (!selectedUser) {
            throw new Error("No user selected");
          }
          response = await sendNotificationToUser(accessToken, {
            userId: selectedUser.id,
            ...notificationData,
          });
          break;
        case "all":
          response = await sendNotificationToAllUsers(
            accessToken,
            notificationData
          );
          break;
        case "consumers":
          response = await sendNotificationToAllConsumers(
            accessToken,
            notificationData
          );
          break;
        case "contractors":
          response = await sendNotificationToAllContractors(
            accessToken,
            notificationData
          );
          break;
      }

      toast({
        title: "Notification sent",
        description: response?.message || "Notification sent successfully",
      });
      closeNotificationDialog();
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete user ${user.email}?`)) return;
    setLoading(true);
    try {
      await requestAccountDeletion(accessToken, { email: user.email });
      // Refresh current page to show updated data
      await loadUsers(pagination.page);
      toast({ title: "User deleted" });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <Button onClick={() => openNotification()} variant="outline">
          Send Bulk Notification
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg border mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) =>
                handleFilterChange("role", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="consumer">Consumer</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="firstname">First Name</SelectItem>
                <SelectItem value="lastname">Last Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => handleFilterChange("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex gap-2">
          <Button onClick={applyFilters} disabled={loading}>
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" disabled={loading}>
            Clear Filters
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.role === "admin"
                      ? "default"
                      : user.role === "contractor"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.createdAt
                  ? format(new Date(user.createdAt), "MM/dd/yyyy")
                  : ""}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openNotification(user)}
                  >
                    Notify
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.totalCount)}{" "}
          of {pagination.totalCount} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
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
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={form.firstname || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={form.lastname || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="phoneNumber">Phone</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={form.phoneNumber || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedUser
                ? `Send Notification to ${selectedUser.email}`
                : "Send Bulk Notification"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNotificationSubmit} className="space-y-4">
            {!selectedUser && (
              <div>
                <Label htmlFor="target">Target Audience</Label>
                <Select
                  value={notificationForm.target}
                  onValueChange={(value: NotificationTarget) =>
                    setNotificationForm((prev) => ({ ...prev, target: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="consumers">All Consumers</SelectItem>
                    <SelectItem value="contractors">All Contractors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={notificationForm.title}
                onChange={handleNotificationChange}
                placeholder="Notification title"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={notificationForm.message}
                onChange={handleNotificationChange}
                placeholder="Notification message"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type (Optional)</Label>
              <Input
                id="type"
                name="type"
                value={notificationForm.type}
                onChange={handleNotificationChange}
                placeholder="e.g., info, announcement, warning"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeNotificationDialog}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Password Verification Required</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {pendingNotificationAction === "bulk"
                ? "Bulk notifications require password verification for security."
                : "Individual notifications require password verification for security."}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closePasswordDialog}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? "Verifying..." : "Verify Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
