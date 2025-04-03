import Image from "next/image";

const RetrospectResultContent = ({
    retrospectContent,
    setRetrospectContent
} : RetrospectContentProps) => {
    const NOT_SELECTED = -1;
    const RESULT_CONTENT = [0, 1, 2, 3, 4];

    const handleResultContentClick = (selected: number) => {
        const selectedResult = selected as ResultContent;
        setRetrospectContent((prev) => ({
            ...prev,
            result: prev.result === selectedResult ? NOT_SELECTED : selectedResult,
        }));
    };

    return (
        <div className="flex gap-[18px]">
            {RESULT_CONTENT.map((num, i) => (
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
    )
}

export default RetrospectResultContent;