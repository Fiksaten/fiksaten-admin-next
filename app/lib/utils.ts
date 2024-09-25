import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildApiUrl(path: string, searchParams?: URLSearchParams): URL {
  let targetPath = path;
  if (path.startsWith('/')) {
    targetPath = path.slice(1);
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fiksaten-dev.online/api/v1"
  const baseUrlWithPath = baseUrl + "/api/v1"
  const url = new URL([baseUrlWithPath, targetPath].join('/'))
  if (searchParams) {
    url.search = new URLSearchParams(searchParams).toString();
  }
  return url;
}



export const formatMessageDate = (dateString: string) => {
  return format(new Date(dateString), 'HH:mm');
};