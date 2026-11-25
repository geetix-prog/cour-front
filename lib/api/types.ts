import type { components } from "@/lib/api/schema";

type S = components["schemas"];

export type Drop = S["Drop"] & { dislikesCount: number; dislikedByMe: boolean };
export type DropPage = Omit<S["DropPage"], "items"> & { items: Drop[] };
export type Category = S["Category"];
export type Health = S["Health"];
export type AuthResponse = S["AuthResponse"];
// schema.d.ts n'est pas à jour : l'API renvoie aussi les champs des réponses.
export type Comment = S["Comment"] & {
  parentId: number | null;
  deleted: boolean;
  repliesCount: number;
  likesCount: number;
  dislikesCount: number;
  likedByMe: boolean;
  dislikedByMe: boolean;
};
export type CommentReactionState = {
  liked: boolean;
  disliked: boolean;
  likesCount: number;
  dislikesCount: number;
};
export type CommentPage = Omit<S["CommentPage"], "items"> & { items: Comment[] };
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
