import { redirect } from 'next/navigation';
export default function Home({}) {
  const adminPrefix = process.env.NEXT_PUBLIC_PREFIX;
  redirect(`${adminPrefix}/v1/dashboard`);
}
