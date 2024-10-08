import { getContractorData, getContractorReviews, getIdToken } from "@/app/lib/actions";
import ReviewsComponent from "./ReviewsComponent";

export default async function ReviewsPage() {
  const idToken = await getIdToken();
  const contractor = await getContractorData(idToken);
  const reviews = await getContractorReviews(idToken);
  console.log(reviews);
  return <ReviewsComponent contractor={contractor} reviews={reviews.reviews} />;
}

