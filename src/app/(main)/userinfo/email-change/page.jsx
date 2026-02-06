'use client';

import React, { useState } from 'react';

export default function EmailChangePage() {
  const [step, setStep] = useState(1);
  const [newEmail, setNewEmail] = useState('');
  const [authCode, setAuthCode] = useState(''); // inputCode 대신 authCode로 통일
  const [isLoading, setIsLoading] = useState(false); // isPending 대신 간단한 isLoading 추가

  const handleSendCode = async () => {
    setIsLoading(true);
    // 실제 구현 시 여기서 fetch 혹은 axios로 백엔드 API를 호출합니다.
    console.log(`${newEmail}로 인증 번호 전송`);
    
    // 임시 딜레이 (네트워크 통신 시뮬레이션)
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyAndSave = () => {
    console.log("인증 완료 및 DB 업데이트");
  };

  return (
    /* 배경색 #695E5C 적용 */
    <div className="max-w-md mx-auto p-8 rounded-2xl shadow-lg border border-opacity-10" style={{ backgroundColor: '#695E5C' }}>
      <h2 className="text-2xl font-bold mb-2 text-white">이메일 변경</h2>
      <p className="text-sm text-gray-200 mb-6">새로운 이메일로 인증을 진행해 주세요.</p>
      
      <div className="space-y-5">
        {/* Email Input Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-100 mb-1.5">새 이메일 주소</label>
          <div className="flex gap-2">
          <input 
              type="email" 
              placeholder="example@choicephoto.app"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={step === 2 || isLoading}
              /* text-black을 최우선으로 적용하고, 모바일 Safari 대응을 위해 opacity-100 추가 */
              className="flex-1 p-3 bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl outline-none transition text-black placeholder-gray-400 disabled:bg-gray-200 opacity-100"
              style={{ color: '#000000', WebkitTextFillColor: '#000000' }} 
            />
            {step === 1 && (
              /* 인증 요청 버튼: 텍스트 노란색 적용 */
              <button 
                onClick={handleSendCode}
                disabled={isLoading}
                className="px-5 py-3 bg-black bg-opacity-40 text-yellow-400 font-bold rounded-xl hover:bg-opacity-60 disabled:bg-gray-500 transition shadow-sm whitespace-nowrap"
              >
                {isLoading ? '전송중' : '인증요청'}
              </button>
            )}
          </div>
        </div>

        {/* Verification Code Field */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-semibold text-gray-100 mb-1.5">인증번호 입력</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="000000"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
            <button 
              onClick={handleVerifyAndSave}
              disabled={isLoading}
              className="w-full py-4 bg-yellow-400 text-[#695E5C] font-bold rounded-xl hover:bg-yellow-500 disabled:bg-gray-400 transition shadow-md"
            >
              {isLoading ? '처리 중...' : '이메일 변경 완료'}
            </button>
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-sm text-gray-300 hover:text-white underline"
            >
              이메일 다시 입력하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}