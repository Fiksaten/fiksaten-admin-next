"use client";

import { GetCurrentUserResponse as User } from "@/app/lib/openapi-client";
import {
  sendNotificationToAllConsumers,
  sendNotificationToAllContractors,
  sendNotificationToAllUsers,
  sendNotificationToUser,
} from "@/app/lib/services/notificationService";
import {
  requestAccountDeletion,
  updateUser,
} from "@/app/lib/services/userService";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  initialUsers: User[];
  accessToken: string;
}

type NotificationTarget = "user" | "all" | "consumers" | "contractors";

export default function UserAdminTable({ initialUsers, accessToken }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  // Add password protection state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingNotificationAction, setPendingNotificationAction] = useState<"bulk" | "individual" | null>(null);

  // Filters
  type RoleFilter = "all" | "admin" | "contractor" | "consumer";
  type TimeframeFilter = "all" | "30d" | "90d" | "365d";
  const [filters, setFilters] = useState<{ role: RoleFilter; timeframe: TimeframeFilter; search: string }>({
    role: "all",
    timeframe: "all",
    search: "",
  });

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "",
    target: "user" as NotificationTarget,
  });

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

  // Modify the openNotification function to require password for bulk notifications
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

  // Add a new function for individual notifications that requires password
  const openIndividualNotificationWithPassword = (user: User) => {
    setSelectedUser(user);
    setPendingNotificationAction("individual");
    setShowPasswordDialog(true);
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
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, ...form } : u))
      );
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
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
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

  const handlePasswordConfirm = () => {
    if (password === "sekoiluonlopetettu") {
      setPasswordError("");
      setPassword("");
      setShowPasswordDialog(false);

      if (pendingNotificationAction === "bulk") {
        openNotification();
      } else if (pendingNotificationAction === "individual") {
        if (selectedUser) {
          openNotification(selectedUser);
        }
      }
      setPendingNotificationAction(null);
    } else {
      setPasswordError("Incorrect password");
      toast({
        title: "Access Denied",
        description: "Wrong password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setPassword("");
    setPasswordError("");
    setShowPasswordDialog(false);
    setPendingNotificationAction(null);
  };

  // Derived filtered users
  const filteredUsers = useMemo(() => {
    const lowerSearch = filters.search.trim().toLowerCase();
    const now = new Date();
    let minDate: Date | null = null;
    if (filters.timeframe === "30d") minDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (filters.timeframe === "90d") minDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    if (filters.timeframe === "365d") minDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    return users
      .filter((u) => {
        // Role filter
        if (filters.role !== "all" && u.role !== filters.role) return false;

        // Timeframe filter (by createdAt)
        if (minDate) {
          const created = u.createdAt ? new Date(u.createdAt) : null;
          if (!created || created < minDate) return false;
        }

        // Search filter (email, firstname, lastname, phone)
        if (lowerSearch) {
          const hay = [
            u.email || "",
            u.firstname || "",
            u.lastname || "",
            u.phoneNumber || "",
          ]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(lowerSearch)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad;
      });
  }, [users, filters]);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <AlertDialogTrigger asChild>
            <Button onClick={() => setShowPasswordDialog(true)} variant="outline">
              Send Bulk Notification
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirm Bulk Notification
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-3">
                  <p className="text-red-600 font-medium">
                    ⚠️ WARNING: You are about to send a bulk notification to multiple users.
                  </p>
                  <p>
                    This action will send notifications to all users, consumers, or contractors based on your selection. 
                    Please enter the confirmation password to proceed.
                  </p>
                  <div className="space-y-2">
                    <label htmlFor="bulk-notification-password" className="text-sm font-medium">
                      Confirmation Password:
                    </label>
                    <Input
                      id="bulk-notification-password"
                      name="bulk-notification-password"
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
                      <p className="text-sm text-red-600">{passwordError}</p>
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
                Continue to Notification
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Name, email, phone"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={filters.role}
            onValueChange={(value: RoleFilter) => setFilters((f) => ({ ...f, role: value }))}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="contractor">Contractor</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timeframe">Created</Label>
          <Select
            value={filters.timeframe}
            onValueChange={(value: TimeframeFilter) => setFilters((f) => ({ ...f, timeframe: value }))}
          >
            <SelectTrigger id="timeframe">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any time</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="365d">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFilters({ role: "all", timeframe: "all", search: "" })}
          >
            Reset
          </Button>
          <div className="text-sm text-muted-foreground ml-auto">{filteredUsers.length} / {users.length}</div>
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
          {filteredUsers.map((user) => (
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
                  ? new Date(user.createdAt).toLocaleDateString()
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openIndividualNotificationWithPassword(user)}
                      >
                        Notify
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                          Confirm Individual Notification
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="space-y-3">
                            <p className="text-red-600 font-medium">
                              ⚠️ WARNING: You are about to send a notification to {user.email}.
                            </p>
                            <p>
                              This action will send a notification to a specific user. 
                              Please enter the confirmation password to proceed.
                            </p>
                            <div className="space-y-2">
                              <label htmlFor="individual-notification-password" className="text-sm font-medium">
                                Confirmation Password:
                              </label>
                              <Input
                                id="individual-notification-password"
                                name="individual-notification-password"
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
                                <p className="text-sm text-red-600">{passwordError}</p>
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
                          Continue to Notification
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
    </div>
  );
}
