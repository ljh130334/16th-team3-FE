'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setShowTooltip(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 bg-black z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <Image
            src="/icons/home/spurt.svg"
            alt="SPURT"
            width={100}
            height={32}
            priority
            className="w-24"
          />
          <Image
            src="/icons/home/mypage.svg"
            alt="My Page"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        <div className="px-4 pb-3">
          <div className="flex space-x-4">
            <div>오늘 할일 <span className="text-purple-400">0</span></div>
            <div className="text-gray-500">전체 할일 0</div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-24 mb-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-6">
            <Image
              src="/icons/home/rocket.svg"
              alt="Rocket"
              width={64}
              height={64}
              className="mx-auto w-16 h-16"
            />
          </div>
          <h2 className="text-xl mb-2">마감 할 일을 추가하고<br />바로 시작해볼까요?</h2>
          <p className="text-gray-500 text-sm">
            미루지 않도록 알림을 보내 챙겨드릴게요.
          </p>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-black z-10">
        <div className="p-4 flex justify-center">
          {showTooltip && (
            <div className="absolute bottom-24 bg-gray-800 rounded-lg px-6 py-3 text-sm">
              지금 바로 할 일을 추가해보세요!
            </div>
          )}
          <Button className="w-32 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-90">
            <Image
              src="/icons/home/plus.svg"
              alt="Add Task"
              width={16}
              height={16}
              className="mr-1"
            />
            할일
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;