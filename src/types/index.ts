/** Shared app types — extend per feature */

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  fcmToken?: string | null;
  createdAt: string;
  updatedAt?: string;
};
