"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TaskResponse } from "@/types/task";
import { useRouter } from "next/navigation";
import RetrospectItem from "./_components/RetrospectItem";
import { useState } from "react";
import RetrospectFocusContent from "./_components/RetrospectFocusContent";
import RetrospectCommentContent from "./_components/RetrospectCommentContent";
import RetrospectResultContent from "./_components/RetrospectResultContent";
import Modal from "@/components/modal/Modal";
import RetrospectLeaveModalContent from "./_components/RetrospectLeaveModalContent";

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

    const [ openLeaveModal, setOpenLeaveModal ] = useState(false);

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
                onClick={() => setOpenLeaveModal(true)}
            > {/* TODO: 뒤로가기가 아니라 모달이 떠야함. (여기서부터) */}
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

            {/* ===================== [START] 저장하지 않고 떠나기 모달 ===================== */}
            {openLeaveModal && (
                <Modal 
                    isOpen={openLeaveModal}
                    onClose={() => setOpenLeaveModal(false)}
                >
                    <RetrospectLeaveModalContent 
                        setOpenLeaveModal={setOpenLeaveModal}
                        router={router}
                    />
                </Modal>
            )}
            {/* --------------------- [END] 저장하지 않고 떠나기 모달 ---------------------*/}

            {/* ===================== [START] Content ===================== */}
            <div className="mt-[44px] overflow-y-auto">

                <div className="flex flex-col"> {/* 회고 내용 */}
                    <div className="flex flex-col gap-3 pt-5 pb-8"> {/* 상단 텍스트 */}
                        <p className="t2 text-strong">이번 몰입은 어떠셨나요?</p>
                        <p className="b2 text-neutral">몰입했던 순간을 돌아보고 기록해보세요.</p>
                    </div>

                    <div className="flex flex-col gap-3"> {/* 실제 유저 회고 부분 */}

                        {/* 몰입 결과 회고 */}
                        <RetrospectItem title={retrospectItems.result.title} required={retrospectItems.result.required}>
                            <RetrospectResultContent 
                                retrospectContent={retrospectContent}
                                setRetrospectContent={setRetrospectContent}
                            />
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