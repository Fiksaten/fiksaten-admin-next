import { getIdToken, getReviews } from "@/app/lib/actions";
import ReviewAdminComponent from "./ReviewAdminComponent";

export default async function Page() {
    const reviews = await getReviews()
    console.log("reviews", reviews)
    const idToken = await getIdToken()
  return (
    <ReviewAdminComponent initialReviews={reviews} idToken={idToken}/>

  );
}
