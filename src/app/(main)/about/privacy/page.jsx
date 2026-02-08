import React from 'react';

export const metadata = {
  title: '개인정보처리방침 - choicephoto.app',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 border-b-2 pb-4 border-blue-600">개인정보처리방침</h1>
      
      <p className="text-right text-sm text-gray-500 mb-6">시행일자: 2026년 2월 7일</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">1. 개인정보 수집 항목 및 목적</h2>
        <p className="mb-2">`choicephoto.app`은 다음과 같은 목적으로 최소한의 개인정보를 수집합니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>전자결제 및 거래:</strong> 원활한 거래 이행 및 고객 응대를 위해 <strong>전화번호, 주소, 이메일</strong>을 수집합니다.</li>
          <li><strong>서비스 운영:</strong> 디지털 사진첩 생성 및 관리, 본인 식별 및 서비스 부정 이용 방지.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">2. 개인정보의 보유 및 이용 기간</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>거래 관련 기록:</strong> 관련 법령에 따라 결제 및 공급 기록을 <strong>5년간</strong> 보관합니다.</li>
          <li><strong>정책에 따른 폐기:</strong> 보안 강화, 법률 변경 또는 서비스 운영 방침에 따라 필요한 경우, 운영진은 <strong>사전 고지 없이 정보를 폐기</strong>할 수 있습니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">3. 법적 대응을 위한 데이터 보관 (특례)</h2>
        <div className="bg-red-50 p-4 border-l-4 border-red-500 rounded">
          <p className="font-medium text-red-800 mb-2">음란, 폭력, 저작권 침해 등 부적절한 콘텐츠가 포함된 거래가 의심되는 경우:</p>
          <p className="text-sm text-red-700">
            해당 데이터(사용자 ID, 거래 기록, 사진 식별자 등)는 사후 분쟁 해결 및 법적 증거 확보를 위해 별도의 분리된 DB 테이블(삭제 관리 테이블)로 이전하여 보관됩니다. 이 데이터는 법적 분쟁 종료 시까지 보관될 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-700">4. 개인정보 보호책임자</h2>
        <div className="bg-gray-50 p-4 rounded border">
          <p><strong>성명:</strong> 태영 (Taeyoung)</p>
          <p><strong>이메일:</strong> <a href="mailto:tseon@opuscore.net" className="underline text-blue-600">tseon@opuscore.net</a></p>
          <p><strong>도메인:</strong> choicephoto.app</p>
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t text-xs text-gray-400 text-center">
        &copy; 2026 choicephoto.app. All rights reserved.
      </footer>
    </div>
  );
}