'use client';

import React, { useState } from 'react';

export default function EmailChangePage() {
  const [step, setStep] = useState(1); // 1: 입력 단계, 2: 인증 번호 단계
  const [newEmail, setNewEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  const handleSendCode = () => {
    // Resend API 호출 로직 (Next.js Server Action 또는 API Route)
    console.log(`${newEmail}로 인증 번호 전송`);
    setStep(2);
  };

  const handleVerifyAndSave = () => {
    // Prisma DB 업데이트 및 인증 확인 로직
    console.log("인증 완료 및 DB 업데이트");
  };


  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">이메일 변경</h2>
      <p className="text-sm text-gray-500 mb-6">새로운 이메일로 인증을 진행해 주세요.</p>
      
      <div className="space-y-5">
        {/* Email Input Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">새 이메일 주소</label>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="example@choicephoto.app"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={step === 2 || isPending}
              className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-50"
            />
            {step === 1 && (
              <button 
                onClick={handleSendCode}
                disabled={isPending}
                className="px-5 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition shadow-sm"
              >
                {isPending ? '전송중' : '인증요청'}
              </button>
            )}
          </div>
        </div>

        {/* Verification Code Field (Visible only after request) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">인증번호 입력</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="000000"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={handleVerifyAndSave}
              disabled={isPending}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition shadow-md"
            >
              {isPending ? '처리 중...' : '이메일 변경 완료'}
            </button>
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-sm text-gray-400 hover:text-gray-600 underline"
            >
              이메일 다시 입력하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
