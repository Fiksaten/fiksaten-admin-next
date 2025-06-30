import { getaccessToken, getReviews } from "@/app/lib/actions";
import ReviewAdminComponent from "./ReviewAdminComponent";

export default async function Page() {
  const reviews = await getReviews();
  console.log("reviews", reviews);
  const accessToken = await getaccessToken();
  return (
    <ReviewAdminComponent initialReviews={reviews} accessToken={accessToken} />
  );
}
