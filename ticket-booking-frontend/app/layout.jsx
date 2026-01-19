import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Ticket Booking & Blogging',
  description: 'Ticket booking and blogging application frontend'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: '1rem' }}>{children}</main>
      </body>
    </html>
  );
}
