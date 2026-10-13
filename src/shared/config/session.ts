export const SESSION_COOKIE = "rs_session";
export const USER_COOKIE = "rs_user";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  email: string;
  emailVerified: boolean;
};
