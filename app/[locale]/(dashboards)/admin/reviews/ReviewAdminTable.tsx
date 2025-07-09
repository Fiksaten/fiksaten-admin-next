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
import { toast } from "@/hooks/use-toast";
import { acceptReview, declineReview } from "@/app/lib/services/reviewService";
import { Review } from "@/app/lib/types/reviewTypes";

interface Props {
  initialReviews: Review[];
  accessToken: string;
}

export default function ReviewAdminTable({
  initialReviews,
  accessToken,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (
    reviewId: string,
    action: "accept" | "decline"
  ) => {
    setLoadingId(reviewId);
    try {
      if (action === "accept") {
        await acceptReview(accessToken, reviewId);
        toast({ title: "Review accepted" });
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, accepted: true } : r))
        );
      } else {
        await declineReview(accessToken, reviewId);
        toast({ title: "Review declined" });
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Accepted</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{review.reviewTitle}</TableCell>
              <TableCell>{review.review}</TableCell>
              <TableCell>{review.starRating}</TableCell>
              <TableCell>{review.accepted ? "Yes" : "No"}</TableCell>
              <TableCell>
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>
                {!review.accepted && (
                  <Button
                    size="sm"
                    className="mr-2"
                    disabled={loadingId === review.id}
                    onClick={() => handleAction(review.id, "accept")}
                  >
                    Accept
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={loadingId === review.id}
                  onClick={() => handleAction(review.id, "decline")}
                >
                  Decline
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
