import { getAllUsers } from "@/app/lib/services/userService";
import { getaccessToken } from "@/app/lib/actions";
import UserAdminTable from "./UserAdminTable";

export default async function UsersPage() {
  const accessToken = await getaccessToken();
  const usersData = await getAllUsers(accessToken);
  const users = usersData?.users || [];
  return <UserAdminTable initialUsers={users} accessToken={accessToken} />;
}
