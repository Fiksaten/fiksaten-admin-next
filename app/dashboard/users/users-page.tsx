"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export type User = {
  id: string;
  sub: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  expoPushToken: string;
  stripeCustomerId: string;
  addressStreet: string;
  addressDetail: string;
  addressZip: string;
  addressCountry: string;
  badgeCountOffers: number;
  badgeCountMessages: number;
  role: string;
  pushNotificationPermission: boolean;
  smsPersmission: boolean;
  emailPermission: boolean;
  created_at: string;
  updated_at: string;
};

export type UsersData = {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export default function UsersPage({
  usersData,
  limit,
  page,
  search,
}: {
  usersData: UsersData;
  limit: number;
  page: number;
  search: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(search);
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", currentPage.toString());
    newParams.set("limit", limit.toString());
    if (searchTerm) {
      newParams.set("search", searchTerm);
    } else {
      newParams.delete("search");
    }
    router.push(`?${newParams.toString()}`);
  }, [searchTerm, currentPage, limit, router, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-black">Users</h1>
      <div className="flex flex-col  mb-4">
        <p className="text-gray-500">Search for firstname, lastname, email</p>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm text-black"
        />
      </div>
      <h3 className="text-black">
        Showing {usersData?.users?.length || 0} users out of{" "}
        {usersData?.totalCount || 0}
      </h3>
      <div className="border rounded-lg">
        {usersData ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usersData.users.map((user) => (
                <TableRow key={user.id} className="text-black">
                  <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                          Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                        >View user details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <h4 className="text-black text-xl">No users match given criteria</h4>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((old) => Math.min(old + 1, usersData?.totalPages))
          }
          disabled={currentPage === usersData?.totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
