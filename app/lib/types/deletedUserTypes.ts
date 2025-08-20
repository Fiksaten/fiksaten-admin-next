import { GetDeletedUsersResponse as GetDeletedUsersResponseApi } from "../openapi-client";

type GetDeletedUsersResponse = GetDeletedUsersResponseApi;

type DeletedUser = GetDeletedUsersResponse[number];

export type { GetDeletedUsersResponse, DeletedUser };
