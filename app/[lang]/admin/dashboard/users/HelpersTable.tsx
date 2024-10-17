"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { HelpersTableModal } from "./HelpersTableModal";
import { ContractorResponse } from "@/app/lib/types";

interface TableProps {
  items: ContractorResponse[];
  idToken: string;
}

export const HelpersTable: React.FC<TableProps> = ({ items, idToken }) => {
  const [helpersModalOpen, setHelpersTableModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ContractorResponse | undefined>();

  return (
    <div className="w-full overflow-auto">
      {helpersModalOpen && selectedItem && (
        <HelpersTableModal
          item={selectedItem}
          idToken={idToken}
          setHelpersTableModalOpen={setHelpersTableModalOpen}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Yritys</TableHead>
            <TableHead>Nimi</TableHead>
            <TableHead>Tila</TableHead>
            <TableHead>Päivämäärä</TableHead>
            <TableHead className="w-[100px]">Muokkaa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.userId}>
              <TableCell className="text-black">
                <Checkbox />
              </TableCell>
              <TableCell className="text-black">{item.contractorName}</TableCell>
              <TableCell className="text-black">{`${item.firstname} ${item.lastname}`}</TableCell>
              <TableCell className="text-black">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.approvalStatus === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                }`}>
                  {item.approvalStatus}
                </span>
              </TableCell>
              <TableCell className="text-black">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}</TableCell>
              <TableCell className="text-black">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setHelpersTableModalOpen(true);
                    setSelectedItem(item);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HelpersTable;