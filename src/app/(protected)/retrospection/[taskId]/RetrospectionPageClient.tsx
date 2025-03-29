"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Image from "next/image";
import { TaskResponse } from "@/types/task";
import { useRouter } from "next/navigation";
import RetrospectItem from "./_components/RetrospectItem";
import { useRef, useState } from "react";

type Props = {
    task: TaskResponse;
}

type RetrospectItems = {
    [key: string]: {
      title: string;
      required: boolean;
    };
};

type ResultContent = -1 | 0 | 1 | 2 | 3 | 4;
type FocusContent =  0 | 1 | 2 | 3 | 4 | 5;

type RetrospectContent = {
    result: ResultContent;
    focus: FocusContent;
    keepAndTry?: string;
}

export default function RetrospectionPageClient({ task }: Props) {
    const NOT_SELECTED = -1;
    const FOCUS_STEPS = [0, 1, 2, 3, 4, 5];

    const router = useRouter();
    const [ retrospectContent, setRetrospectContent ] = useState<RetrospectContent>({
        result: NOT_SELECTED,
        focus: 0,
    });

    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleResultContentClick = (selected: number) => {
        const selectedResult = selected as ResultContent;
        setRetrospectContent((prev) => ({
            ...prev,
            result: prev.result === selectedResult ? NOT_SELECTED : selectedResult,
        }));
    };

    const hasSelectedResult = () => {
        return retrospectContent.result !== -1;
    }

    const setFocusContent = (selected: number) => {
        const selectedFocus = selected as FocusContent;
        setRetrospectContent((prev) => ({
            ...prev,
            focus: selectedFocus,
        }));
    };

    const getClosestIndex = (x: number): number => {
        console.log(`getClosestIndex: ${x}`);
        const track = trackRef.current;
        if (!track) return retrospectContent.focus;
      
        const MAX_INDEX = FOCUS_STEPS.length - 1;

        const rect = track.getBoundingClientRect();
        const offsetX = x - rect.left;
        const ratio = offsetX / rect.width;
        const rawIndex = Math.round(ratio * MAX_INDEX);
        console.log(`rawIndex: ${rawIndex}`);
        return Math.min(Math.max(rawIndex, 0), MAX_INDEX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        console.log(`handleMouseMove: ${e.clientX}`);
        if (!isDragging.current) return;
        const idx = getClosestIndex(e.clientX);
        setFocusContent(idx);
    };
      
    const handleMouseDown = (e: React.MouseEvent) => {
        console.log(`handleMouseDown: ${e.clientX}`);
        const idx = getClosestIndex(e.clientX);
        console.log(`handleMouseDown Result: ${idx}`);
        setFocusContent(idx);
        isDragging.current = true;
        
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };
      
    const handleMouseUp = () => {
        console.log("handleMouseUp");
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const hasRequiredContent = hasSelectedResult()
        && retrospectContent.focus !== undefined;


    const retrospectItems : RetrospectItems = {
        result: {
            title: "몰입한 결과에 얼마나 만족하시나요?",
            required: true
        },
        focus: {
            title: "몰입하는 동안 나의 집중력은?",
            required: true
        },
        keepAndTry: {
            title: "이번 몰입의 좋았던 점과 개선할 점은?",
            required: false
        }
    }
  
    return (
        <div className = "flex flex-col h-full bg-backgroud-primary mx-5 mb-[34px]">
            {/* ===================== [START] 상단 헤더 ===================== */}
            <div className="fixed left-0 right-0 top-0 z-10 mt-[44px] mx-5 flex items-center bg-background-primary py-[14.5px]">
            <button 
                className="absolute left-0"
                onClick={() => router.back()}
            > {/* TODO: 뒤로가기가 아니라 팝업이 떠야함. */}
                <Image
                src="/icons/home/arrow-left.svg"
                alt="Back"
                width={18}
                height={16}
                />
            </button>
            <h1 className="s2 w-full text-center text-lg font-semibold text-text-normal">
                {task.name}
            </h1>
            </div>
            {/* --------------------- [END] 상단 헤더 ---------------------*/}

            {/* ===================== [START] Content ===================== */}
            <div className="mt-[44px]">

                <div className="flex flex-col"> {/* 회고 내용 */}
                    <div className="flex flex-col gap-3 pt-5 pb-8"> {/* 상단 텍스트 */}
                        <p className="t2 text-strong">이번 몰입은 어떠셨나요?</p>
                        <p className="b2 text-neutral">몰입했던 순간을 돌아보고 기록해보세요.</p>
                    </div>

                    <div className="flex flex-col gap-3"> {/* 실제 유저 회고 부분 */}

                        {/* 몰입 결과 회고 */}
                        <RetrospectItem title={retrospectItems.result.title} required={retrospectItems.result.required}>
                            <div className="flex gap-[18px]">
                            {[0, 1, 2, 3, 4].map((num) => (
                                <div onClick={() => handleResultContentClick(num)}>
                                    <Image
                                        src={`/retro1-${num}-${retrospectContent.result === num ? 1 : 0}.svg`}
                                        alt="retro content index"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                
                            ))}
                            </div>
                        </RetrospectItem>

                        {/* 몰입하는 동안 나의 집중력 */}
                        <RetrospectItem title={retrospectItems.focus.title} required={retrospectItems.focus.required}>
                            <div className="w-full mx-2">
                                <div 
                                    ref={trackRef}
                                    className="relative h-6 flex items-center"
                                    onMouseDown={handleMouseDown}
                                >
                                    {/* 전체 바 배경 */}
                                    <div 
                                        className="absolute h-6 rounded-full bg-gray-600"
                                        style={{
                                            width: "calc(100% + 24px)", // 16px 양쪽 추가
                                            left: "-12px",              // 왼쪽으로 16px 이동
                                        }}
                                    ></div>

                                    {/* 선택된 채워진 부분 */}
                                    <div
                                    className="absolute h-6 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 transition-all duration-200"
                                    style={{
                                        width: `calc(${(retrospectContent.focus / 5) * 100}% + 24px)`,
                                        left: `-12px`,
                                    }}
                                    ></div>

                                    {/* 점들 */}
                                    <div className="relative z-10 flex justify-between w-full">
                                        {FOCUS_STEPS.map((step, i) => (
                                            <div
                                            key={i}
                                            className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ${
                                                retrospectContent.focus >= step
                                                ? "bg-white opacity-90"
                                                : "bg-white opacity-30"
                                            }`}
                                            onClick={() => setFocusContent(i)}
                                            />
                                        ))}
                                    </div>

                                    {/* 슬라이더 핸들 */}
                                    <div
                                    className="absolute m-3 z-20 w-6 h-6 rounded-full border-2 border-white bg-white shadow"
                                    style={{
                                        left: `calc(${(retrospectContent.focus / 5) * 100}% - 24px)`,
                                        transition: "left 0.2s ease",
                                    }}
                                    />
                                    </div>

                                {/* 아래 숫자 레이블 */}
                                <div className="mt-1 flex justify-between text-gray-400 text-sm font-medium">
                                    {FOCUS_STEPS.map((step, i) => (
                                        <div key={i} className="w-[6px] flex justify-center">
                                            <span key={i} className={retrospectContent.focus === step ? "text-white" : ""}>
                                                {`${step*20}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RetrospectItem>

                        {/* 몰입 회고 텍스트 */}
                        <RetrospectItem title={retrospectItems.keepAndTry.title} required={retrospectItems.keepAndTry.required}>
                            <p>몰입 결과 입력</p>
                        </RetrospectItem>
                    </div>
                </div>

                <div> {/* 확인 버튼 */}
                    <Button
                    variant="primary"
                    className="my-3"
                    onClick={() => {}}
                    disabled={!hasRequiredContent}
                    >
                    확인
                    </Button>
                </div>

            </div>
            {/* --------------------- [END] Content --------------------- */}

        </div>
    );
};