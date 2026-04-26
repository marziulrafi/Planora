export type UserRole = "USER" | "ADMIN";
export type EventType = "PUBLIC" | "PRIVATE";
export type ParticipantStatus = "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  phone?: string | null;
  status?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue?: string | null;
  eventLink?: string | null;
  date: string;
  time: string;
  type: EventType;
  fee: number;
  isFeatured: boolean;
  ownerId: string;
  owner?: User;
}

export interface Participant {
  id: string;
  status: ParticipantStatus;
  userId: string;
  eventId: string;
  joinedViaInvitation?: boolean;
  paidAt?: string | null;
  user?: User;
  event?: Event;
}

export interface Invitation {
  id: string;
  status: InvitationStatus;
  senderId: string;
  receiverId: string;
  eventId: string;
  event?: Event;
  sender?: User;
  receiver?: User;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  eventId: string;
  userId: string;
  event?: Event;
}
