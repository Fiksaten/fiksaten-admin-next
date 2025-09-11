import { getaccessToken } from "@/app/lib/actions";
import { getUsersInsights } from "@/app/lib/services/adminService";
import { getAllUsers } from "@/app/lib/services/userService";
import UserAdminTable from "./UserAdminTable";
import UsersInsightsClient from "./ui/UsersInsightsClient";

export default async function UsersPage() {
  const accessToken = await getaccessToken();
  const [usersData, insights] = await Promise.all([
    getAllUsers(accessToken),
    getUsersInsights(accessToken ?? undefined),
  ]);
  return (
    <div className="space-y-6">
      <UserAdminTable initialData={usersData} accessToken={accessToken} />
      <UsersInsightsClient insights={insights} />
    </div>
  );
}
