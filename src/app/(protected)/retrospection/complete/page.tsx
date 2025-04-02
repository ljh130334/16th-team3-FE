"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RetrospectionCompletePage() {
    const router = useRouter();

    return (
        <div className="flex h-full flex-col gap-4 bg-background-primary">
            <div className="mt-[180px] flex flex-col items-center gap-2">

                {/* 이미지 */}
                <div className="h-[180px] flex items-center justify-center">
                    <Image src="/retro-complete.svg" alt="logo" width={142} height={80} />
                </div>

                {/* 메인 텍스트 */}
                <div className="flex flex-col gap-1 text-center">
                    <p className="text-t3">회고 작성 완료!</p>
                    <p className="text-t3">오늘의 몰입 멋지게 정리했어요</p>
                </div>
            </div>
            <div className="relative mt-auto flex flex-col items-center px-5 py-6">
                <Button
                    variant="primary"
                    className="relative mb-4 w-full"
                    onClick={() => router.push("/")}
                >
                    홈으로 이동하기
                </Button>
            </div>
        </div>
    );
}
