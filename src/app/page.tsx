import { redirect } from 'next/navigation';
export default function Home({}) {
  redirect(`${process.env.NEXT_PUBLIC_ASSETS_PREFIX}/v1/dashboard`);
}
