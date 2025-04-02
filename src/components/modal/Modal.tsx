import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 흐림 + 어두운 투명도 */}
      <div
        className="absolute inset-0 bg-elevated-secondary opacity-70"
      />

      {/* 모달 콘텐츠 */}
      <div
        className="z-50 bg-component-gray-secondary rounded-[24px] px-4 pt-6 pb-4 relative"
        style={{
            width: "calc(100% - 48px)",
        }}
        onClick={(e) => e.stopPropagation()} // 배경 클릭 방지
      >
        {children}
      </div>
    </div>
  );
}
