import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: '최애의 포토',
  description: '개인용 디지털 사진첩 생성 플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
