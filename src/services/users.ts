import { TUser } from "./auth";

type TUserAccount = TUser & {
  password?: string;
};

export const users: TUserAccount[] = [
  {
    avatar: "https://avatars.githubusercontent.com/u/0?v=4",
    name: "Seongnam Noh",
    nickName: "성남 노",
    email: "minuee@kormedi.com",
    role: "admin",
    password: "1234",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/0?v=3",
    name: "Hyungjin Park",
    nickName: "형진 박",
    email: "tony@kormedi.com",
    role: "admin",
    password: "1234",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/0?v=2",
    name: "Wonjae Lee",
    nickName: "CTO",
    email: "wjlee@kormedi.com",
    role: "admin",
    password: "1234",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/0?v=1",
    name: "Kyunghwan Heo",
    nickName: "경환 허",
    email: "kyunghwan.heo@kormedi.com",
    role: "admin",
    password: "1234",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/0?v=0",
    name: "Jinyoung Shin",
    nickName: "진영 신",
    email: "jyonkmd@kormedi.com",
    role: "admin",
    password: "1234",
  },
];
