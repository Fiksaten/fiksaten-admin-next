import { getReviews } from "@/app/lib/services/reviewService";
import { getaccessToken } from "@/app/lib/actions";
import ReviewAdminTable from "./ReviewAdminTable";

export default async function ReviewsPage() {
  const accessToken = await getaccessToken();
  const reviews = await getReviews(accessToken);
  return (
    <ReviewAdminTable initialReviews={reviews} accessToken={accessToken} />
  );
}
