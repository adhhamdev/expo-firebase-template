/** Shared app types — extend per feature */

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  phoneVerified?: boolean;
  fcmToken?: string | null;
  createdAt: string;
  updatedAt?: string;
  lastActiveAt?: string;
};
