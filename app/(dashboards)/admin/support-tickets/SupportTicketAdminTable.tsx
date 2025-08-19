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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { Eye, MessageSquare, Clock } from "lucide-react";
import {
  updateCustomerServiceTicket,
} from "@/app/lib/services/supportTicketService";
import { GetCustomerServiceTicketsResponse } from "@/app/lib/openapi-client";
import { useRouter } from "next/navigation";

interface Props {
  tickets: GetCustomerServiceTicketsResponse;
  accessToken: string;
}

export default function SupportTicketAdminTable({
  tickets,
  accessToken,
}: Props) {
  const router = useRouter();

  const { user } = useAuth();
  const [ticketList, setTicketList] = useState(tickets.tickets);
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState<
    "all" | "assigned" | "unassigned"
  >("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "status" | "admin">(
    "newest"
  );

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

  const filteredTickets = ticketList
    .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
    .filter((t) =>
      assignedFilter === "all"
        ? true
        : assignedFilter === "assigned"
        ? Boolean(t.assignedAdminId)
        : !t.assignedAdminId
    )
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.user.email.toLowerCase().includes(q) ||
        t.user.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "admin":
          return (a.assignedAdminId || "").localeCompare(
            b.assignedAdminId || ""
          );
        default:
          return 0;
      }
    });

  const handleViewTicket = (
    ticket: GetCustomerServiceTicketsResponse["tickets"][number]
  ) => {
    router.push(`/admin/support-tickets/${ticket.id}`);
  };


  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateCustomerServiceTicket(
        accessToken,
        ticketId,
        { status: newStatus as "pending" | "seen" | "answered" },
      );
      toast({
        title: "Status updated",
        description: `Ticket status changed to ${newStatus}.`,
      });
      setTicketList((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (ticketId: string, adminId: string | null) => {
    try {
      await updateCustomerServiceTicket(
        accessToken,
        ticketId,
        { assignedAdminId: adminId },
      );
      toast({
        title: adminId ? "Ticket assigned" : "Ticket unassigned",
      });
      setTicketList((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, assignedAdminId: adminId } : t
        )
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to update assignment.",
        variant: "destructive",
      });
    } 
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow border">
        <div className="flex flex-wrap items-end gap-2 p-4">
          <Input
            placeholder="Search user id or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={assignedFilter}
            onValueChange={(v) =>
              setAssignedFilter(v as "all" | "assigned" | "unassigned")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sort}
            onValueChange={(v: "newest" | "oldest" | "status" | "admin") =>
              setSort(v)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="admin">Assigned Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
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
                  {ticket.assignedAdminId
                    ? ticket.assignedAdminId
                    : "Unassigned"}
                </TableCell>
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
                    {user &&
                      (ticket.assignedAdminId === user.id ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAssign(ticket.id, null)}
                        >
                          Unassign
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAssign(ticket.id, user.id)}
                        >
                          Assign to me
                        </Button>
                      ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
    </>
  );
}
