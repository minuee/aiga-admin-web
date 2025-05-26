import { redirect } from 'next/navigation';
export default function Home({}) {
  const prefixHead = process.env.NODE_ENV == 'development' ? "" : "/admin"
  redirect(`${prefixHead}/v1/dashboard`);
}
