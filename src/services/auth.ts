import { users } from "./users";

export type TUser = {
  avatar?: string;
  name?: string;
  nickName?: string;
  email?: string;
  role?: string;
};

interface AuthProvider {
  isAuthenticated: boolean;
  user: null | TUser;
  signin(nickName: string, password: string | null): Promise<any>;
  signout(): Promise<void>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const authProvider: AuthProvider = {
  isAuthenticated: false,
  user: null,
  async signin(username: string, password: string | null) {
    await new Promise((r) => setTimeout(r, 500)); // fake delay
    const user = users.find(
      (x) =>
        ( x.email === username) &&
        x.password === password,
    );
    if (user) {
      authProvider.isAuthenticated = true;
      authProvider.user = user;
      return {
        is_ok : true,
        data : user
      }
    }
    return {
      is_ok : false,
      data : null
    }
  },
  async signout() {
    await new Promise((r) => setTimeout(r, 500)); // fake delay
    authProvider.isAuthenticated = false;
    authProvider.user = null;
  },
};
