export default function AuthLayout({ children }) {
  return (
    <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      {children}
    </section>
  );
}
