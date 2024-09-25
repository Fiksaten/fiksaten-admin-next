import { getUser, getUserOrders } from "@/app/lib/actions";
import UserInfo from "./userInfo";
import { Suspense } from 'react';
import UserOrders from './userOrders';

type UserInfoProps = {
  params: { id: string  }
  searchParams: { page: string, limit: string }
};

export default async function Home({ params, searchParams }: UserInfoProps) {
    const userData = await getUser(params.id);
    const page = parseInt(searchParams.page) || 1;
    const limit = parseInt(searchParams.limit) || 5;
    const userOrders = await getUserOrders(params.id, page, limit);
    console.log("userOrders", userOrders);
  return (
    <>
      <UserInfo userData={userData}/>
      <Suspense fallback={<div>Loading orders...</div>}>
      <h2 className="text-2xl font-bold text-black">Orders</h2>
      <h2 className="text-sm text-gray-500">Showing {userOrders?.orders.length} of {userOrders?.totalCount} orders</h2>
        <UserOrders 
          userOrders={userOrders?.orders || []} 
          totalOrders={userOrders?.totalCount || 0} 
          currentPage={page} 
          limit={limit} 
          userId={params.id}
        />
      </Suspense>
    </>
  );
}
