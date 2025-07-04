import {
  AddNewReviewForContractorData,
  GetAllReviewsResponse,
  GetReviewsForContractorResponse,
} from "../openapi-client";

type ReviewResponse = GetReviewsForContractorResponse;
type ReviewBody = AddNewReviewForContractorData["body"];
type Reviews = GetAllReviewsResponse;
type Review = Reviews[number];

export type { ReviewResponse, ReviewBody, Reviews, Review };
