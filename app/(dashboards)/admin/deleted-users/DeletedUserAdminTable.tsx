"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DeletedUser } from "@/app/lib/types/deletedUserTypes";

interface Props {
  initialUsers: DeletedUser[];
  accessToken: string;
}

export default function DeletedUserAdminTable({ initialUsers }: Props) {
  const [users] = useState(initialUsers);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Deleted At</TableHead>
          <TableHead>Anonymized At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.deletedAt}</TableCell>
            <TableCell>{user.anonymizedAt ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
