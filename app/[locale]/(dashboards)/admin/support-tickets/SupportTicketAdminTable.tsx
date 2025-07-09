"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, MessageSquare, Clock, User, Mail, Phone } from "lucide-react";
import {
  respondToSupportTicket,
  updateCustomerServiceTicket,
} from "@/app/lib/services/supportTicketService";
import { GetCustomerServiceTicketsResponse } from "@/app/lib/openapi-client";

interface Props {
  tickets: GetCustomerServiceTicketsResponse;
  accessToken: string;
}

export default function SupportTicketAdminTable({
  tickets,
  accessToken,
}: Props) {
  const [selectedTicket, setSelectedTicket] = useState<
    GetCustomerServiceTicketsResponse[number] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const parseContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.content || content;
    } catch {
      return content;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          >
            Pending
          </Badge>
        );
      case "open":
        return (
          <Badge
            variant="default"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            Open
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewTicket = (
    ticket: GetCustomerServiceTicketsResponse[number]
  ) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTicket(null);
    setReplyMessage("");
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsLoading(true);
    try {
      await respondToSupportTicket(
        accessToken,
        selectedTicket.id,
        replyMessage
      );
      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the customer.",
      });
      setReplyMessage("");
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      await updateCustomerServiceTicket(
        accessToken,
        ticketId,
        newStatus as "pending" | "seen" | "answered",
        null // assignedAdminId
      );
      toast({
        title: "Status updated",
        description: `Ticket status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {ticket.user.firstname} {ticket.user.lastname}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {ticket.user.email}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {ticket.user.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate font-medium">
                      {parseContent(ticket.content)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ticket.messages.length}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {ticket.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(ticket.id, "open")}
                      >
                        Open
                      </Button>
                    )}
                    {ticket.status === "open" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(ticket.id, "closed")}
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Support Ticket Details</DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">
                        {selectedTicket.user.firstname}{" "}
                        {selectedTicket.user.lastname}
                      </p>
                    </div>
                    <div>
                      <Label>Role</Label>
                      <p className="capitalize">{selectedTicket.user.role}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <p>{selectedTicket.user.email}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <p>{selectedTicket.user.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedTicket.status)}
                      </div>
                    </div>
                    <div>
                      <Label>Initial Message</Label>
                      <p className="mt-1 p-3 bg-muted rounded-md">
                        {parseContent(selectedTicket.content)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Created</Label>
                        <p>{formatDate(selectedTicket.createdAt)}</p>
                      </div>
                      <div>
                        <Label>Last Updated</Label>
                        <p>{formatDate(selectedTicket.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              {selectedTicket.messages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Messages ({selectedTicket.messages.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className="p-3 bg-muted rounded-md"
                        >
                          <p>{parseContent(message.message)}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCloseDialog}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleReply}
                        disabled={isLoading || !replyMessage.trim()}
                      >
                        {isLoading ? "Sending..." : "Send Reply"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
