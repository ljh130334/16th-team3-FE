import { useRef } from "react";

type Props = {
    retrospectContent: RetrospectContent;
    setRetrospectContent: React.Dispatch<React.SetStateAction<RetrospectContent>>;
}

const BAR = {
    HEIGHT: 18,
    SLIDER_RADIUS: 12,
}

const RetrospectFocusContent = ({
    retrospectContent,
    setRetrospectContent,
} : Props) => {
    const FOCUS_STEPS = [0, 1, 2, 3, 4, 5];
    //TODO: 슬라이더 핸들 반지름 상수화

    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const setFocusContent = (selected: number) => {
        const selectedFocus = selected as FocusContent;
        setRetrospectContent((prev) => ({
            ...prev,
            focus: selectedFocus,
        }));
    };

    const getClosestIndex = (x: number): number => {
        // console.log(`getClosestIndex: ${x}`);
        const track = trackRef.current;
        if (!track) return retrospectContent.focus;
      
        const MAX_INDEX = FOCUS_STEPS.length - 1;

        const rect = track.getBoundingClientRect();
        const offsetX = x - rect.left;
        const ratio = offsetX / rect.width;
        const rawIndex = Math.round(ratio * MAX_INDEX);
        // console.log(`rawIndex: ${rawIndex}`);
        return Math.min(Math.max(rawIndex, 0), MAX_INDEX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        // console.log(`handleMouseMove: ${e.clientX}`);
        if (!isDragging.current) return;
        const idx = getClosestIndex(e.clientX);
        setFocusContent(idx);
    };
      
    const handleMouseDown = (e: React.MouseEvent) => {
        // console.log(`handleMouseDown: ${e.clientX}`);
        const idx = getClosestIndex(e.clientX);
        // console.log(`handleMouseDown Result: ${idx}`);
        setFocusContent(idx);
        isDragging.current = true;
        
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };
      
    const handleMouseUp = () => {
        // console.log("handleMouseUp");
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="w-full mx-2 mt-1">
            <div 
                ref={trackRef}
                className={`relative h-[${BAR.HEIGHT}px] flex items-center`}
                onMouseDown={handleMouseDown}
            >
                {/* 전체 바 배경 */}
                <div 
                    className={`absolute h-[${BAR.HEIGHT}px] rounded-full bg-line-tertiary`}
                    style={{
                        width: `calc(100% + ${BAR.SLIDER_RADIUS*2}px)`, // 16px 양쪽 추가
                        left: `-${BAR.SLIDER_RADIUS}px`,              // 왼쪽으로 16px 이동
                    }}
                ></div>

                {/* 선택된 채워진 부분 */}
                <div
                className={`absolute h-[${BAR.HEIGHT}px] rounded-full bg-gradient-to-r from-blue-200 to-purple-200 transition-all duration-200`}
                style={{
                    width: `calc(${(retrospectContent.focus / 5) * 100}% + ${BAR.SLIDER_RADIUS*2}px)`,
                    left: `-${BAR.SLIDER_RADIUS}px`,
                }}
                ></div>

                {/* 점들 */}
                <div className="relative z-10 flex justify-between w-full">
                    {FOCUS_STEPS.map((step, i) => (
                        <div
                        key={i}
                        className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ${
                            retrospectContent.focus >= step
                            ? "bg-background-skyblue opacity-90"
                            : "bg-background-skyblue opacity-30"
                        }`}
                        onClick={() => setFocusContent(i)}
                        />
                    ))}
                </div>

                {/* 슬라이더 핸들 */}
                <div
                className={`absolute m-3 z-20 w-${BAR.SLIDER_RADIUS*2/4} h-${BAR.SLIDER_RADIUS*2/4} rounded-full border-2 border-white bg-white shadow`}
                style={{
                    left: `calc(${(retrospectContent.focus / 5) * 100}% - ${BAR.SLIDER_RADIUS*2}px)`,
                    transition: "left 0.2s ease",
                }}
                />
                </div>

                {/* 아래 숫자 레이블 */}
                <div className="mt-1.5 flex justify-between c3 text-gray-alternative font-medium">
                    {FOCUS_STEPS.map((step, i) => (
                        <div key={i} className="w-[6px] flex justify-center">
                            <span key={i} className={retrospectContent.focus === step ? "text-gray-alternative" : ""}>
                                {`${step*20}`}
                            </span>
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default RetrospectFocusContent;