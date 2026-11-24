import type { components } from "@/lib/api/schema";

type S = components["schemas"];

export type Drop = S["Drop"] & { dislikesCount: number; dislikedByMe: boolean };
export type DropPage = Omit<S["DropPage"], "items"> & { items: Drop[] };
export type Category = S["Category"];
export type Health = S["Health"];
export type AuthResponse = S["AuthResponse"];
export type Comment = S["Comment"];
export type CommentPage = S["CommentPage"];
export type PublicUser = S["PublicUser"];
export type Profile = S["Profile"];
export type PrivateUser = S["PrivateUser"];
export type LikeState = S["LikeState"];

export type Notification = {
  kind: "drop_opened" | "drop_liked" | "drop_commented";
  dropId: number;
  dropTitle: string;
  by: PublicUser;
  at: string;
};
