"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Image from "next/image";
import { TaskResponse } from "@/types/task";
import { useRouter } from "next/navigation";
import RetrospectItem from "./_components/RetrospectItem";
import { useRef, useState } from "react";
import RetrospectFocusContent from "./_components/RetrospectFocusContent";
import RetrospectCommentContent from "./_components/RetrospectCommentContent";

type Props = {
    task: TaskResponse;
}

export default function RetrospectionPageClient({ task }: Props) {
    const NOT_SELECTED = -1;

    const router = useRouter();
    const [ retrospectContent, setRetrospectContent ] = useState<RetrospectContent>({
        result: NOT_SELECTED,
        focus: 0,
        comment: "",
    });

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
                            {[0, 1, 2, 3, 4].map((num, i) => (
                                <div key={i} onClick={() => handleResultContentClick(num)}>
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
                            <RetrospectFocusContent 
                                retrospectContent={retrospectContent}
                                setRetrospectContent={setRetrospectContent}
                            />
                        </RetrospectItem>

                        {/* 몰입 회고 텍스트 */}
                        <RetrospectItem title={retrospectItems.keepAndTry.title} required={retrospectItems.keepAndTry.required}>
                            <RetrospectCommentContent 
                                retrospectContent={retrospectContent}
                                setRetrospectContent={setRetrospectContent}
                            />
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