import React from 'react';

export const metadata = {
  title: '이용약관 - choicephoto.app',
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 border-b-2 pb-4 border-green-600">서비스 이용약관</h1>
      
      <p className="text-right text-sm text-gray-500 mb-6">최종 수정일: 2026년 2월 7일</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-green-700">제1조 (목적)</h2>
        <p className="text-white">본 약관은 `choicephoto.app`이 제공하는 디지털 사진 생성 플랫폼 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-green-700">제2조 (부적절한 콘텐츠의 관리 및 데이터 처리)</h2>
        <p className="mb-3 text-white">1. 본 서비스는 개인의 소중한 디지털 자산을 생성하는 플랫폼으로, 타인의 저작권을 침해하거나 사회적으로 금지된 콘텐츠(음란물, 누드, 폭력물 등)의 거래를 엄격히 금지합니다.</p>
        
        <div className="bg-yellow-50 p-5 border rounded-lg border-yellow-200">
          <p className="font-bold mb-2 text-yellow-800 underline">2. 부정 이용 의심 시 기술적 조치:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-900">
            <li>의심되는 사용자의 ID 및 해당 <strong>photo_card_id</strong>의 수량(quantity)을 즉시 <strong>'0'</strong>으로 변경하여 서비스 화면에서 차단합니다.</li>
            <li>해당 레코드는 시스템에서 영구 삭제하지 않고, 법적 대응을 위해 <strong>'별도 삭제 관리 테이블'</strong>로 이전하여 보관합니다.</li>
            <li>운영진은 효율적인 법적 대응 및 증거 확보를 위해 해당 조치에 대한 <strong>사전 고지 여부를 직접 판단</strong>할 수 있습니다.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-green-700">제3조 (저작권 및 법적 책임)</h2>
        <p className="mb-2 text-white">1. 사용자가 업로드하거나 생성한 콘텐츠의 저작권 책임은 전적으로 사용자 본인에게 있습니다.</p>
        <p className="mb-2 font-bold text-white underline">2. 불법적 사용으로 인해 서비스 및 제3자에게 손해를 끼친 경우, 해당 사용자는 민·형사상의 모든 법적 책임을 부담하며 수사기관의 조사에 성실히 임해야 합니다.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-green-700">제4조 (준거법 및 재판관할)</h2>
        <p className="text-white">본 약관과 관련하여 발생하는 모든 분쟁은 대한민국 법령을 준거법으로 하며, 관할 법원은 서비스 제공자의 소재지 관할 법원으로 합니다.</p>
      </section>

    </div>
  );
}