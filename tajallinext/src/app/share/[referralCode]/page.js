// app/share/[referralCode]/page.js
import { redirect } from 'next/navigation';

export default function ReferralRedirect({ params }) {
  const { referralCode } = params;

  // 👇 This should immediately redirect to the register page
  redirect(`/register?ref=${referralCode}`);
}
