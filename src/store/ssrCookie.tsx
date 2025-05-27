"use server";
import { cookies } from "next/headers";

export const delCookie = async (name: string) => {
    const res2 = (await cookies()).delete(name);
    //console.log("delCookie 1",res2)
    const res = (await cookies()).set(name , '', {
        path: "/",
        domain: "localhost",
        maxAge: 0,
        httpOnly: true,
        secure: false,
    }).toString();

    //console.log("delCookie 2",res2)
    return res;
}