import { TUser } from "./auth";

type TUserAccount = TUser & {
  password?: string;
};

export const users: TUserAccount[] = [
  {
    avatar: "https://avatars.githubusercontent.com/u/0?v=4",
    name: "Seongnam Noh",
    nickName: "노성남",
    email: "minuee@kormedi.com",
    role: "admin",
    password: "1234",
  },
];
