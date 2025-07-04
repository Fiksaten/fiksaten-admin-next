import {
  GetCurrentUserResponse,
  GetCurrentUserResponses,
  RequestAccountDeletionData,
  UpdateCurrentUserData,
  GetAllUsersResponse as GetAllUsersResponseApi,
} from "../openapi-client";

type User = GetCurrentUserResponse;
type UserUpdateBody = UpdateCurrentUserData["body"];
type RequestAccountDeletionBody = RequestAccountDeletionData["body"];
type GetAllUsersResponse = GetAllUsersResponseApi;

export type {
  User,
  UserUpdateBody,
  RequestAccountDeletionBody,
  GetAllUsersResponse,
};
