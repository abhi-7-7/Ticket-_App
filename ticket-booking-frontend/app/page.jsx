import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Ticket Booking & Blogging</h1>
      <p>This is the Home page (Next.js App Router).</p>
      <p>
        Visit the <Link href="/about">About</Link> page.
      </p>
    </div>
  );
}
