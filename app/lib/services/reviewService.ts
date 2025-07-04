import {
  acceptReview as acceptReviewApi,
  declineReview as declineReviewApi,
  getReviewsForContractor,
  addNewReviewForContractor,
  getAllReviews,
} from "../openapi-client";
import { ReviewBody } from "../types/reviewTypes";

const acceptReview = async (accessToken: string, reviewId: string) => {
  const res = await acceptReviewApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      reviewId: reviewId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const declineReview = async (accessToken: string, reviewId: string) => {
  const res = await declineReviewApi({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      reviewId: reviewId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getContractorReviews = async (
  accessToken: string,
  contractorId: string
) => {
  const res = await getReviewsForContractor({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    path: {
      contractorId: contractorId,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const createReview = async (
  accessToken: string,
  contractorId: string,
  review: ReviewBody
) => {
  const res = await addNewReviewForContractor({
    path: {
      contractorId: contractorId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: review,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getReviews = async (accessToken: string) => {
  const res = await getAllReviews({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

export {
  acceptReview,
  declineReview,
  getContractorReviews,
  createReview,
  getReviews,
};
