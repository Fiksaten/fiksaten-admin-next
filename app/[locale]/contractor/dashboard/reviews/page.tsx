import {
  getContractorData,
  getContractorReviews,
  getaccessToken,
} from "@/app/lib/actions";
import ReviewsComponent from "./ReviewsComponent";

export default async function ReviewsPage() {
  const accessToken = await getaccessToken();
  const contractor = await getContractorData(accessToken);
  const reviews = await getContractorReviews(accessToken);
  console.log(reviews);
  return <ReviewsComponent contractor={contractor} reviews={reviews.reviews} />;
}
