import {
  GetContractorResponse,
  ContractorJoinRequestData,
  UpdateCurrentContractorDataData,
  GetAllContractorJoinRequestsResponse,
  GetCurrentContractorDataResponse,
} from "../openapi-client";

type ContractorResponse = GetContractorResponse;
type ContractorUpdateBody = UpdateCurrentContractorDataData["body"];
type ContractorJoinRequestBody = ContractorJoinRequestData["body"];
type ContractorJoinRequests = GetAllContractorJoinRequestsResponse;
type CurrentContractorResponse = GetCurrentContractorDataResponse;
export type {
  ContractorResponse,
  ContractorUpdateBody,
  ContractorJoinRequestBody,
  ContractorJoinRequests,
  CurrentContractorResponse,
};
