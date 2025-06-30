import {
  getaccessToken,
  getUsers,
  getContractorRequests,
} from "@/app/lib/actions";
import UsersPage from "./users-page";
import HelpersTable from "./HelpersTable";

type UserProps = {
  params: Promise<{ page: number; limit: number }>;
  searchParams: Promise<Record<string, string>> | undefined;
};

export default async function Home(props: UserProps) {
  const searchParams = (await props.searchParams) || {};
  const limit = searchParams?.limit ? parseInt(searchParams.limit, 10) : 10;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams?.search || "";
  const accessToken = await getaccessToken();
  const usersData = await getUsers(limit, page, search);
  const contractorRequests = await getContractorRequests();

  return (
    <div className="p-6">
      <HelpersTable items={contractorRequests} accessToken={accessToken} />
      <UsersPage
        usersData={usersData}
        limit={limit}
        page={page}
        search={search}
      />
    </div>
  );
}
