import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateToTimeAgo(date: string): string {
  const parsedDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - parsedDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
  if (months >= 1) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  if (days >= 1) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes >= 1) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
}

