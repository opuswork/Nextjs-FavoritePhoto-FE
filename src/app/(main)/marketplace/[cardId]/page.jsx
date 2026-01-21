export default function MarketplaceCardDetailPage({ params }) {
  return (
    <div className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-10">
        <h1 className="text-[24px] font-semibold">카드 상세</h1>
        <p className="mt-2 text-white/70">cardId: {params?.cardId}</p>
      </div>
    </div>
  );
}
