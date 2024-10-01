"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { OrderWithOffers } from "@/app/lib/types";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface UserOrdersProps {
    userOrders: OrderWithOffers[];
    totalOrders: number;
    currentPage: number;
    limit: number;
    userId: string;
}

const UserOrders = ({ userOrders, totalOrders, currentPage, limit, userId }: UserOrdersProps) => {
    const [selectedOrder, setSelectedOrder] = useState<OrderWithOffers | null>(null);
    const router = useRouter();

    const totalPages = Math.ceil(totalOrders / limit);

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/users/${userId}?page=${newPage}&limit=${limit}`);
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black">Order ID</TableHead>
                        <TableHead className="text-black">Title</TableHead>
                        <TableHead className="text-black">Category</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                        <TableHead className="text-black">Created At</TableHead>
                        <TableHead className="text-black">Offers</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userOrders.map((order) => (
                        <TableRow key={order.orderId} className="cursor-pointer hover:bg-gray-100" onClick={() => setSelectedOrder(order)}>
                            <TableCell className="text-black">{order.orderId}</TableCell>
                            <TableCell className="text-black">{order.title}</TableCell>
                            <TableCell className="text-black">{order.categoryName}</TableCell>
                            <TableCell className="text-black">{order.status}</TableCell>
                            <TableCell className="text-black">{new Date(order.orderCreatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-black">{order.offers.length}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
                <Button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>

            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="text-white bg-black">
                    <DialogHeader>
                        <DialogTitle>Offers for Order: {selectedOrder?.title}</DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Offer ID</TableHead>
                                <TableHead className="text-white">Contractor ID</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white">Price</TableHead>
                                <TableHead className="text-white">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedOrder?.offers.map((offer) => (
                                <TableRow key={offer.id}>
                                    <TableCell className="text-white">{offer.id}</TableCell>
                                    <TableCell className="text-white">{offer.contractorId}</TableCell>
                                    <TableCell className="text-white">{offer.status}</TableCell>
                                    <TableCell className="text-white">{offer.offerPrice}</TableCell>
                                    <TableCell className="text-white">{new Date(offer.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserOrders;