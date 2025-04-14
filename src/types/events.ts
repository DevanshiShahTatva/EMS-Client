import { LucideIcon } from "lucide-react";
export type EventStatus = 'ongoing' | 'ended' | 'upcoming';
export type EventCategory = 'movies' | 'conference' | 'party' | 'music' | 'dance' | 'all';
export type SortOption = 'none' | 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';
export interface EventData {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  priceRange: string;
  category: EventCategory;
  isSoldOut: boolean;
  isLiked: boolean;
  status: EventStatus;
  isFeatured?: boolean;
}
  export interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
  }
  