import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthWrapper } from './auth-provider';

export const metadata = {
  title: 'Ticket Booking & Blogging',
  description: 'Ticket booking and blogging application frontend'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <div className="app-container">
            <Navbar />
            <main className="page">
              {children}
            </main>
            <Footer />
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}
