// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
//TODO: Fix this file

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import {
  User,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Send,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Users,
  ArrowLeft,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

// Enhanced types based on design document
interface EnhancedTicket {
  id: string;
  userId: string;
  content: string;
  category: "technical" | "billing" | "general" | "bug_report";
  priority: "low" | "normal" | "high" | "urgent";
  status: "pending" | "seen" | "answered" | "resolved" | "closed";
  assignedAdminId: string | null;
  userTimezone: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    phoneNumber: string | null;
    role: "consumer" | "contractor";
  };
  messages: TicketMessage[];
  // Computed properties
  isArchived: boolean;
  lastActivityAt: string;
  unreadCount: number;
}

interface TicketMessage {
  id: string;
  customerServiceTicketId: string;
  message: string;
  sender: "user" | "admin";
  senderUserId: string;
  senderName: string;
  createdAt: string;
  updatedAt: string;
  // Computed properties for display
  localTimestamp: string;
  isFromCurrentUser: boolean;
}

type TicketStatus = "pending" | "seen" | "answered" | "resolved" | "closed";

interface AdminTicketDetailProps {
  ticket: EnhancedTicket;
  messages: TicketMessage[];
  onReply: (message: string) => Promise<void>;
  onStatusChange: (status: TicketStatus) => Promise<void>;
  onAssign: (adminId: string | null) => Promise<void>;
  onBack: () => void;
  currentAdminId: string;
  availableAdmins: Array<{ id: string; name: string }>;
}

export const AdminTicketDetail: React.FC<AdminTicketDetailProps> = ({
  ticket,
  messages,
  onReply,
  onStatusChange,
  onAssign,
  onBack,
  currentAdminId,
  availableAdmins,
}) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleReply = async () => {
    if (!replyMessage.trim() || isReplying) return;

    setIsReplying(true);
    try {
      await onReply(replyMessage);
      setReplyMessage("");
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssign = async (adminId: string | null) => {
    if (isAssigning) return;

    setIsAssigning(true);
    try {
      await onAssign(adminId);
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        variant: "secondary",
        icon: Clock,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      seen: {
        variant: "default",
        icon: CheckCircle,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      answered: {
        variant: "default",
        icon: MessageSquare,
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      resolved: {
        variant: "outline",
        icon: CheckCircle,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      closed: {
        variant: "outline",
        icon: XCircle,
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: {
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: AlertCircle,
      },
      high: {
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        icon: AlertCircle,
      },
      normal: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: null,
      },
      low: {
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        icon: null,
      },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.normal;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      technical: {
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      },
      billing: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      general: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      bug_report: {
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    };

    const config =
      categoryConfig[category as keyof typeof categoryConfig] ||
      categoryConfig.general;

    return (
      <Badge variant="outline" className={config.className}>
        {category.replace("_", " ").charAt(0).toUpperCase() +
          category.replace("_", " ").slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const getInitials = (firstname: string | null, lastname: string | null) => {
    return (
      `${firstname?.charAt(0) || ""}${
        lastname?.charAt(0) || ""
      }`.toUpperCase() || "U"
    );
  };

  const isAssignedToCurrentAdmin = ticket.assignedAdminId === currentAdminId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tickets
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Ticket #{ticket.id.slice(-8)}
            </h1>
            <p className="text-muted-foreground">
              Created {formatDate(ticket.createdAt)} • Last updated{" "}
              {formatRelativeTime(ticket.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(ticket.status)}
          {getPriorityBadge(ticket.priority)}
          {getCategoryBadge(ticket.category)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Message */}
          <Card>
            <CardHeader>
              <CardTitle>Original Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap">{ticket.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation ({messages.length} messages)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No messages yet. Be the first to reply!
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === "admin"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex gap-3 max-w-[80%]",
                          message.sender === "admin"
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.sender === "admin"
                              ? "A"
                              : getInitials(
                                  ticket.user.firstname,
                                  ticket.user.lastname
                                )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            message.sender === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="whitespace-pre-wrap">
                            {message.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <span>{message.senderName}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(message.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Reply Section */}
          <Card>
            <CardHeader>
              <CardTitle>Reply to Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reply">Your Reply</Label>
                  <Textarea
                    id="reply"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                    disabled={isReplying}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={isReplying || !replyMessage.trim()}
                  >
                    {isReplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {getInitials(ticket.user.firstname, ticket.user.lastname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {ticket.user.firstname} {ticket.user.lastname}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {ticket.user.role === "contractor" ? (
                      <Building2 className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    <span className="capitalize">{ticket.user.role}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${ticket.user.email}`}
                    className="text-sm hover:underline"
                  >
                    {ticket.user.email}
                  </a>
                </div>

                {ticket.user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${ticket.user.phoneNumber}`}
                      className="text-sm hover:underline"
                    >
                      {ticket.user.phoneNumber}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{ticket.userTimezone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Customer since {formatDate(ticket.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Management */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Management */}
              <div>
                <Label>Status</Label>
                <Select
                  value={ticket.status}
                  onValueChange={(value: TicketStatus) =>
                    handleStatusChange(value)
                  }
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="seen">Seen</SelectItem>
                    <SelectItem value="answered">Answered</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignment Management */}
              <div>
                <Label>Assigned Admin</Label>
                <Select
                  value={ticket.assignedAdminId || "unassigned"}
                  onValueChange={(value) =>
                    handleAssign(value === "unassigned" ? null : value)
                  }
                  disabled={isAssigning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {availableAdmins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {!isAssignedToCurrentAdmin ? (
                    <Button
                      size="sm"
                      onClick={() => handleAssign(currentAdminId)}
                      disabled={isAssigning}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign to Me
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssign(null)}
                      disabled={isAssigning}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Unassign
                    </Button>
                  )}

                  {ticket.status !== "resolved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange("resolved")}
                      disabled={isUpdatingStatus}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  )}

                  {ticket.status !== "closed" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Close
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Close Ticket</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to close this ticket? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusChange("closed")}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Close Ticket
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages:</span>
                <span>{messages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatRelativeTime(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Activity:</span>
                <span>{formatRelativeTime(ticket.lastActivityAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time:</span>
                <span>
                  {messages.length > 0
                    ? formatRelativeTime(messages[0].createdAt)
                    : "No response yet"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
