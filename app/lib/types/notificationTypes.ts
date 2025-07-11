import {
  SendCustomNotificationToUserData,
  SendCustomNotificationToAllUsersData,
  SendCustomNotificationToAllConsumersData,
  SendCustomNotificationToAllContractorsData,
} from "../openapi-client";

type SendNotificationToUserBody = SendCustomNotificationToUserData["body"];
type SendNotificationToAllUsersBody =
  SendCustomNotificationToAllUsersData["body"];
type SendNotificationToAllConsumersBody =
  SendCustomNotificationToAllConsumersData["body"];
type SendNotificationToAllContractorsBody =
  SendCustomNotificationToAllContractorsData["body"];

export type {
  SendNotificationToUserBody,
  SendNotificationToAllUsersBody,
  SendNotificationToAllConsumersBody,
  SendNotificationToAllContractorsBody,
};
