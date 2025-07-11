import { ContractorJoinRequestData, RegisterData } from "../openapi-client";

type Register = NonNullable<RegisterData["body"]>;

type ContractorRegisterData = NonNullable<ContractorJoinRequestData["body"]>;

export type { Register, ContractorRegisterData };
