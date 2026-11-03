export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export type StudioCategory = (typeof CATEGORIES)[number];

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
  ownerEmail: string;
  ownerName: string;
  ownerPhoto?: string;
  createdAt: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  ownerEmail: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  totalCost: number;
  note: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  _id: string;
  studioId: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StudioInput {
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}
