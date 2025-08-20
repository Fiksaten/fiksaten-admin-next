import {
  acceptReview as acceptReviewApi,
  declineReview as declineReviewApi,
  getReviewsForContractor,
  addNewReviewForContractor,
  getAllReviews,
  AddNewReviewForContractorData,
} from "../openapi-client";
import { resolveToken } from "./util";

type ReviewBody = AddNewReviewForContractorData["body"];

const acceptReview = async (
  accessToken: string | undefined,
  reviewId: string,
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await acceptReviewApi({
    headers: {
      Authorization: `Bearer ${token}`,
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

const declineReview = async (
  accessToken: string | undefined,
  reviewId: string,
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await declineReviewApi({
    headers: {
      Authorization: `Bearer ${token}`,
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
  accessToken: string | undefined,
  contractorId: string
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getReviewsForContractor({
    headers: {
      Authorization: `Bearer ${token}`,
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
  accessToken: string | undefined,
  contractorId: string,
  review: ReviewBody
) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await addNewReviewForContractor({
    path: {
      contractorId: contractorId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: review,
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
};

const getReviews = async (accessToken?: string) => {
  const token =
    resolveToken(accessToken);
  if (!token) {
    throw new Error("No access token available");
  }
  const res = await getAllReviews({
    headers: {
      Authorization: `Bearer ${token}`,
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
