import { redirect } from 'next/navigation';

// This component renders nothing itself but triggers a redirect.
// This ensures that users landing on the root URL are immediately
// sent to the main doctors listing page.
export default function RootPage() {
  redirect('/doctors');
  // The redirect function throws a NEXT_REDIRECT error, so this component
  // will effectively stop rendering here and the redirect will occur.
  // No need to return any JSX from here.
}
