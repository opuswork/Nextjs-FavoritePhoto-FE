export default function HomePage() {
  return (
    <main style={{ padding: 16 }}>
      API BASE: {process.env.NEXT_PUBLIC_API_BASE_URL ?? 'undefined'}
    </main>
  );
}
