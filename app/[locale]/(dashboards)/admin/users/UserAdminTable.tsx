"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateUser,
  requestAccountDeletion,
} from "@/app/lib/services/userService";
import {
  sendNotificationToUser,
  sendNotificationToAllUsers,
  sendNotificationToAllConsumers,
  sendNotificationToAllContractors,
} from "@/app/lib/services/notificationService";
import { User } from "@/app/lib/types/userTypes";

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

  const openNotification = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setNotificationForm((prev) => ({ ...prev, target: "user" }));
    }
    setNotificationOpen(true);
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

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <Button onClick={() => openNotification()} variant="outline">
          Send Bulk Notification
        </Button>
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
