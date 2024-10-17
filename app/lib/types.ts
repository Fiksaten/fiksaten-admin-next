
export type TotalUsers = {
    total: number;
    consumers: string;
    contractors: string;
    admins: string;
};


export type Review = {
  id: string;
  userId: string;
  starRating: number;
  reviewTitle: string;
  review: string;
  userFirstname: string;
  userZip: string;
};

export type AdminReview = {
  id: string;
  userId: string;
  starRating: number;
  reviewTitle: string;
  review: string;
  userFirstname: string;
  userZip: string | null;
  createdAt: string;
  orderId: string;
  accepted: boolean;
  userCity: string;
}

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

export type Metrics = {
    avgBudget: string;
    avgRating: string;
    mostCommonCategories: {
      categoryCount: number;
      categoryId: string;
      categoryName: string;
    }[];
    offerAcceptanceRate: number;
    retentionRate: number;
    topClients: {
      totalRevenue: number;
      userId: string;
      name: string;
    }[];
    totalMaterialCost: number;
    totalProjects: number;
    totalRevenue: number;
  };

  
  export type Contractor = {
    contractorAddressCountry: string;
    contractorAddressDetail: string;
    contractorAddressStreet: string;
    contractorAddressZip: string;
    contractorBic: string;
    contractorBusinessId: string;
    contractorCategoryId: string;
    contractorDescription: string;
    contractorEmail: string;
    contractorFirstname: string;
    contractorId: string;
    contractorLastname: string;
    contractorHeaderImageUrl: string;
    contractorIban: string;
    contractorImageUrl: string;
    contractorName: string;
    contractorPhone: string;
    contractorReviewAverage: string;
    contractorReviewCount: number;
    contractorVerified: boolean;
    contractorWebsite: string;
    created_at: string;
    updated_at: string;
    userId: string;
  };
  

  export type ContractorData = {
    id: string;
    sub: string | null;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    expoPushToken: string | null;
    stripeCustomerId: string | null;
    addressStreet: string | null;
    addressDetail: string | null;
    addressZip: string | null;
    addressCountry: string | null;
    badgeCountOffers: number;
    badgeCountMessages: number;
    role: string;
    pushNotificationPermission: boolean;
    smsPersmission: boolean;
    emailPermission: boolean;
    created_at: string;
    updated_at: string;
    userId: string;
    contractorName: string;
    contractorDescription: string;
    contractorWebsite: string;
    contractorEmail: string;
    contractorPhone: string;
    contractorAddressStreet: string;
    contractorAddressDetail: string | null;
    contractorAddressZip: string;
    contractorAddressCountry: string;
    contractorImageUrl: string;
    contractorReviewAverage: number | null;
    contractorReviewCount: number | null;
    contractorVerified: boolean;
    contractorBusinessId: string | null;
    contractorCategoryId: string;
    contractorHeaderImageUrl: string;
    contractorIban: string;
    contractorBic: string;
    approvalStatus: string;
  }

  
export type ExtendedOrder = RequestOrder & OrderDetails

export type RequestOrder = {
    orderId: string;
    title: string;
    description: string;
    budget: string;
    status: string;
    startDate: string;
    endDate: string;
    orderCreatedAt: string;
    orderUpdatedAt: string;
    categoryName: string;
    categoryDescription: string;
    categoryImageUrl: string;
    offersCount: number;
    offerCreatedAt: string;
    orderTimeLabel: string;
    isOfferSent: boolean;
};

export type OrderDetails = {
    orderId: string;
    offerId?: string;
    userId: string;
    contractorId: string;
    categoryId: string;
    title: string;
    description: string;
    attachments: string;
    budget: string;
    status: string;
    orderStreet: string;
    orderCity: string;
    orderZip: string;
    locationMoreInfo: string;
    scheduleOption: string;
    paymentMethod: string;
    categoryName: string;
    startDate: string;
    endDate: string;
    orderCreatedAt: string;
    orderUpdatedAt: string;
    userFirstname: string;
    userLastname: string;
    userEmail: string;
    userAddressStreet: string;
    userAddressDetail: string;
    userAddressZip: string;
    userAddressCountry: string;
    userRole: string;
    categoryCategoryName: string;
    categoryCategoryImageUrl: string;
    categoryDescription: string;
};


export interface Category {
  id: string;
  categoryName: string;
  categoryImageUrl: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ContractorCategory {
  id: string;
  categoryId: string;
  contractorId: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  categories: Category;
  contractorCategories: ContractorCategory;
}

export type OfferDetails = {
  date: Date;
  startTime: Date; // For example 13.10
  endTime: Date; // for example 21.30
  offerPrice: number;
  materialCost: number;
  offerDescription: string;
  status: string;
  orderId: string;
};

export type RegisterData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export type ContractorRegisterData = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  businessId: string;
  companyDescription: string;
  companyImageUrl: string;
}

export type ContractorResponse = {
  userId: string;
  contractorName: string;
  contractorDescription: string;
  contractorWebsite: string;
  contractorEmail: string;
  contractorPhone: string;
  contractorAddressStreet: string;
  contractorAddressDetail: string;
  contractorAddressZip: string;
  contractorAddressCountry: string;
  contractorImageUrl: string;
  contractorReviewAverage: string;
  contractorReviewCount: number;
  contractorVerified: boolean;
  contractorBusinessId: string;
  contractorCategoryId: string;
  contractorHeaderImageUrl: string;
  contractorIban: string | null;
  contractorBic: string | null;
  approvalStatus: string;
  created_at: string;
  updated_at: string;
  firstname: string;
  lastname: string;
};