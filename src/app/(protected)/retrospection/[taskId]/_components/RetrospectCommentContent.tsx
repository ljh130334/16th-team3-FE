const RetrospectCommentContent = ({
    retrospectContent,
    setRetrospectContent,
} : RetrospectContentProps) => {
    const MAX_LENGTH = 100;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_LENGTH) {
            setRetrospectContent((prev) => ({
                ...prev,
                comment: value,
            }));
        }
    }

    return (
        <div className="flex flex-col w-full gap-3 px-4 py-3 bg-component-gray-tertiary rounded-[11.25px]">
            <textarea
                value={retrospectContent.comment}
                onChange={handleChange}
                placeholder="좋았던 점과 개선할 점을 간단히 작성해주세요."
                className="w-full h-40 bg-component-gray-tertiary b3 text-gray-normal placeholder-text-gray-normal rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* TODO: 초과로 입력하면 빨간 메시지  */}
            <div className="c2 text-right text-gray-alternative">
                {retrospectContent.comment.length} / {MAX_LENGTH}자
            </div>
        </div>
    )
}

export default RetrospectCommentContent;