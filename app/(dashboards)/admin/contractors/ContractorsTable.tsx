"use client";

import type { GetAllContractorsResponses } from "@/app/lib/openapi-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Contractors = GetAllContractorsResponses[200];

type Props = {
  initialContractors: Contractors;
};

function Stars({ avg }: { avg: string | null }) {
  if (!avg) return <span className="text-muted-foreground">-</span>;
  const n = Math.round(parseFloat(avg));
  const stars = Array.from({ length: 5 }).map((_, i) => (i < n ? "★" : "☆"));
  return <span className="text-yellow-500">{stars.join("")}</span>;
}

function ApprovalBadge({ status }: { status: string | null }) {
  if (!status) return <Badge variant="secondary">Unknown</Badge>;
  const variant =
    status === "approved" ? "default" : status === "pending" ? "secondary" : "destructive";
  return <Badge variant={variant}>{status}</Badge>;
}

function StripeBadge({ connected }: { connected: boolean }) {
  return (
    <Badge variant={connected ? "default" : "secondary"}>
      {connected ? "Stripe Connected" : "Stripe Not Connected"}
    </Badge>
  );
}

export default function ContractorsTable({ initialContractors }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const contractors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialContractors;
    return initialContractors.filter((c) => {
      const hay = [
        c.name,
        c.email,
        c.phone,
        c.businessId ?? "",
        c.addressStreet ?? "",
        c.addressZip ?? "",
        c.approvalStatus ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [initialContractors, search]);

  return (
    <div className="rounded-lg border bg-card shadow p-4 dark:bg-card dark:border-muted">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, phone, business ID, status"
          />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-muted-foreground">
            {contractors.length} / {initialContractors.length}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Contractor</TableHead>
            <TableHead className="text-foreground">Contact</TableHead>
            <TableHead className="text-foreground">Business</TableHead>
            <TableHead className="text-foreground">Reviews</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractors.map((c) => (
            <TableRow key={c.userId} className="hover:bg-muted/50 dark:hover:bg-muted">
              <TableCell className="text-foreground">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={c.imageUrl ?? undefined} alt={c.name} />
                    <AvatarFallback>
                      {c.name?.slice(0, 2).toUpperCase() || "CO"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.description || "—"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                <div className="flex flex-col">
                  <span>{c.email}</span>
                  <span className="text-xs text-muted-foreground">{c.phone}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                <div className="flex flex-col">
                  <span>{c.businessId ?? "-"}</span>
                  <span className="text-xs text-muted-foreground">
                    {[c.addressStreet, c.addressZip, c.addressCountry].filter(Boolean).join(", ") ||
                      "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                <div className="flex flex-col">
                  <Stars avg={c.reviewAverage} />
                  <span className="text-xs text-muted-foreground">
                    {c.reviewAverage ?? "-"} ({Math.round(c.reviewCount ?? 0)})
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                <div className="flex flex-col gap-1">
                  <ApprovalBadge status={c.approvalStatus} />
                  <StripeBadge connected={!!c.stripeConnected} />
                </div>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/contractors/${c.userId}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}