import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: '#000000', width: '100%' }}>{children}</main>
      <Footer />
    </>
  );
}
