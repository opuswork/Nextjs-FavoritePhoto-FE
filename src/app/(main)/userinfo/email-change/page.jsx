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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 text-gray-800">이메일 주소 변경</h2>
      
      <div className="space-y-4">
        {/* 현재 이메일 (변경 불가) */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">현재 이메일</label>
          <input 
            type="text" 
            value="user@example.com" 
            disabled 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* 새 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">새 이메일 주소</label>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="new-email@choicephoto.app"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={step === 2}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {step === 1 && (
              <button 
                onClick={handleSendCode}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition text-sm whitespace-nowrap"
              >
                인증 요청
              </button>
            )}
          </div>
        </div>

        {/* 인증 번호 입력란 (인증 요청 후에만 표시) */}
        {step === 2 && (
          <div className="animate-fade-in-down">
            <label className="block text-sm font-medium text-gray-700 mb-1">인증 번호 6자리</label>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-lg font-bold"
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              메일을 받지 못하셨나요? <button className="underline hover:text-blue-600">재발송</button>
            </p>
          </div>
        )}

        {/* 최종 변경 버튼 */}
        <button 
          onClick={handleVerifyAndSave}
          disabled={step === 1}
          className={`w-full py-3 rounded-lg font-semibold transition mt-4 ${
            step === 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          이메일 변경 완료
        </button>
      </div>
    </div>
  );
}
