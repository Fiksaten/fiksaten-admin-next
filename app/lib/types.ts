
export type TotalUsers = {
    total: number;
    consumers: string;
    contractors: string;
    admins: string;
};

export type NewUsersOverTime = {
    date: string;
    newUsers: number;
};

export type OrderStatusDistribution = {
    pending: string;
    accepted: string;
    declined: string;
    waitingForPayment: string;
    done: string;
};

export type TopCategoriesByOrder = {
    categoryId: string;
    categoryName: string;
    orderCount: number;
};
export type DashboardStatsResponse = {
    totalUsers: TotalUsers;
    newUsersOverTime: NewUsersOverTime[];
    orderStatusDistribution: OrderStatusDistribution;
    averageOrderValue: string;
    topCategoriesByOrders: TopCategoriesByOrder[];
    activeConversations: number;
    unreadMessagesCount: number;
    startDate: string;
    endDate: string;
};