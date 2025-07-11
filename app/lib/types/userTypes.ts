import {
  GetCurrentUserResponse,
  RequestAccountDeletionData,
  UpdateCurrentUserData,
  GetAllUsersResponse as GetAllUsersResponseApi,
  SendCustomNotificationToUserData,
  SendCustomNotificationToAllUsersData,
  SendCustomNotificationToAllConsumersData,
  SendCustomNotificationToAllContractorsData,
} from "../openapi-client";

type User = GetCurrentUserResponse;
type UserUpdateBody = UpdateCurrentUserData["body"];
type RequestAccountDeletionBody = RequestAccountDeletionData["body"];
type GetAllUsersResponse = GetAllUsersResponseApi;

// Notification types
type SendNotificationToUserBody = SendCustomNotificationToUserData["body"];
type SendNotificationToAllUsersBody =
  SendCustomNotificationToAllUsersData["body"];
type SendNotificationToAllConsumersBody =
  SendCustomNotificationToAllConsumersData["body"];
type SendNotificationToAllContractorsBody =
  SendCustomNotificationToAllContractorsData["body"];

export type {
  User,
  UserUpdateBody,
  RequestAccountDeletionBody,
  GetAllUsersResponse,
  SendNotificationToUserBody,
  SendNotificationToAllUsersBody,
  SendNotificationToAllConsumersBody,
  SendNotificationToAllContractorsBody,
};
