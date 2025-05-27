"use server";
import { cookies } from "next/headers";

export const delCookie = async (name: string) => {
  (await cookies()).delete(name)
}