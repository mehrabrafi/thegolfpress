import Header from '@/components/Header';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'TheGolfPress - Live News & Leaderboard',
  description: 'Your ultimate source for real-time golf scores, news, and insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <footer style={{ padding: '60px 0', background: 'white', marginTop: '60px', borderTop: '1px solid #eee' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
              <div>
                <h4 style={{ marginBottom: '20px' }}>TheGolfPress</h4>
                <p style={{ color: '#777', fontSize: '0.9rem' }}>Your ultimate source for real-time golf scores, news, and insights.</p>
              </div>
              <div>
                <h4 style={{ marginBottom: '20px' }}>Scores</h4>
                <ul style={{ color: '#777', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>PGA Tour</li>
                  <li>LIV Golf</li>
                  <li>LPGA Tour</li>
                  <li>DP World Tour</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '20px' }}>News</h4>
                <ul style={{ color: '#777', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>Latest Headlines</li>
                  <li>Gear Reviews</li>
                  <li>Instruction</li>
                  <li>Course Reviews</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '20px' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', background: '#ccc', borderRadius: '50%' }}></div>
                  <div style={{ width: '32px', height: '32px', background: '#ccc', borderRadius: '50%' }}></div>
                  <div style={{ width: '32px', height: '32px', background: '#ccc', borderRadius: '50%' }}></div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
              <span>© 2026 TheGolfPress. All rights reserved.</span>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
