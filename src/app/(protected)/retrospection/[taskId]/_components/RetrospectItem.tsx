import { Badge } from "@/components/component/Badge";

type RetrospectItemProps = {
    title: string;
    required: boolean;
    children: React.ReactNode;
};

const RetrospectItem = ({ title, required, children} : RetrospectItemProps) => {
    return (
        <div className="flex flex-col gap-3 p-5 bg-component-gray-secondary rounded-[16px]">
            <div className="flex justify-between"> {/* 질문 및 필수여부 */}
                <span className="s2 text-normal">{title}</span>
                <Badge styleSet={required ? "required" : "notRequired"}>
                    <span className="c2">{required ? "필수" : "선택"}</span>
                </Badge>
            </div>

            <div className="flex justify-center items-center"> {/* 사용자 입력 영역 */}
                {children}
            </div>
        </div>
    );
}

export default RetrospectItem;