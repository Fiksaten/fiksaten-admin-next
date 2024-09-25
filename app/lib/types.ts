
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

type Offer = {
    date: string | null;
    id: string;
    created_at: string;
    updated_at: string;
    contractorId: string;
    orderId: string;
    categoryId: string;
    status: string;
    startTime: string | null;
    endTime: string | null;
    offerPrice: string | null;
    materialCost: string | null;
    offerDescription: string | null;
}
export type OrderWithOffers = {
  orderId: string;
  userId: string;
  contractorId: string | null;
  categoryId: string;
  title: string | null;
  description: string | null;
  attachments: string | null;
  budget: string | null;
  status: string;
  orderStreet: string | null;
  orderCity: string | null;
  orderZip: string | null;
  locationMoreInfo: string | null;
  scheduleOption: string | null;
  paymentMethod: string | null;
  categoryName: string | null;
  startDate: string | null;
  endDate: string | null;
  orderCreatedAt: string;
  orderUpdatedAt: string;
  categoryImageUrl: string | null;
  categoryDescription: string | null;
  orderOfferCount: number;
  offers: Offer[];
}
