import {
  GetOrderDetailsResponse,
  GetOrdersByUserIdResponse,
  GetOwnDraftOrdersResponse,
} from "../openapi-client";

type OwnOrderResponse = GetOwnDraftOrdersResponse["orders"];
type OwnOrder = OwnOrderResponse[number];
type OrderDetailsResponse = GetOrderDetailsResponse;
type GetUserOrdersResponse = GetOrdersByUserIdResponse;

export type {
  OwnOrderResponse,
  OwnOrder,
  OrderDetailsResponse,
  GetUserOrdersResponse,
};
