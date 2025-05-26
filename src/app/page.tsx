import { redirect } from 'next/navigation';
export default function Home({}) {
  console.log("process.env.NEXT_PUBLIC_ASSETS_PREFIX",process.env.NEXT_PUBLIC_ASSETS_PREFIX)
  redirect(`${process.env.NEXT_PUBLIC_ASSETS_PREFIX}/v1/dashboard`);
}
