export {
  completePendingSocialRegistration,
  getPendingSocialRegistration,
  isSocialRegistrationRequired,
  reauthenticateWithApple,
  reauthenticateWithGoogle,
  SocialRegistrationRequiredError,
  signInWithApple,
  signInWithGoogle,
} from "./social-auth.native";
export type { SocialSignInResult } from "./social-auth.native";
