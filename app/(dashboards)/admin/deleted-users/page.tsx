import { getDeletedUsers } from "@/app/lib/services/deletedUserService";
import { getaccessToken } from "@/app/lib/actions";
import DeletedUserAdminTable from "./DeletedUserAdminTable";

export default async function DeletedUsersPage() {
  const accessToken = await getaccessToken();
  const users = await getDeletedUsers(accessToken);
  return (
    <DeletedUserAdminTable initialUsers={users} accessToken={accessToken} />
  );
}
