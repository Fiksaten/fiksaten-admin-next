import { getUsers } from "@/app/lib/actions";
import UsersPage from "./users-page";

type UserProps = {
  params: { page:number, limit: number }
  searchParams: Record<string, string> | null | undefined;
};

export default async function Home({ searchParams }: UserProps) {
  const limit = searchParams?.limit ? parseInt(searchParams.limit, 10) : 10;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const search = searchParams?.search || "";

  const usersData = await getUsers(limit, page, search);
  
  return (
    <div className="p-6">
    <UsersPage 
      usersData={usersData}
      limit={limit} 
      page={page} 
      search={search} 
    />
    </div>
  );
}
