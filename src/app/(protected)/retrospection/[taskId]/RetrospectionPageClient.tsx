"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Image from "next/image";
import { TaskResponse } from "@/types/task";
import { useRouter } from "next/navigation";

type Props = {
    task: TaskResponse;
}

export default function RetrospectionPageClient({ task }: Props) {
  const router = useRouter();
  
  return (
    <div className = "relative flex flex-col h-full bg-backgroud-primary px-5 mb-[34px]">
      {/* ===================== [START] 상단 헤더 ===================== */}
      <header className="absolute relative w-full top-0 z-10 flex items-center bg-background-primary py-[14.5px]">
        <button 
          className="absolute left-0"
          onClick={() => router.back()}>
          <Image
            src="/icons/home/arrow-left.svg"
            alt="Back"
            width={18}
            height={16}
          />
        </button>
        <h1 className="s2 flex-1 text-center text-lg font-semibold text-text-normal">
          {task.name}
        </h1>
      </header>
      {/* --------------------- [END] 상단 헤더 ---------------------*/}

      
      {/* ===================== [START] 확인 버튼 ===================== */}
      <div>
        <Button
          variant="primary"
          className="my-3"
          onClick={() => {}}
          disabled={true}
        >
          확인
        </Button>
      </div>
      {/* --------------------- [END] 확인 버튼 ---------------------*/}

    </div>
  );
};