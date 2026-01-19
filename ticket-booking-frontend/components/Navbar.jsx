import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/hotels">Hotels</Link>
      <Link href="/blogs">Blogs</Link>
      <Link href="/login">Login</Link>
    </nav>
  );
}
