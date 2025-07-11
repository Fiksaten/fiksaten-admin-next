
export type UnreadCountType = {
	dashboard: number;
	newRequest: number;
	orders: number;
	settings: number;
	chats: number;
}

export type UnreadCountKeyType = 'dashboard' | 'newRequest' | 'orders' | 'settings' | 'chats'

export type NavLinkType = {
	href: string;
	text: string;
	unreadCounts?: UnreadCountType;
	resetUnreadCount?: (unreadCountKeyType: UnreadCountKeyType) => void;
	countKey?: UnreadCountKeyType;
}
