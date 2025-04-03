import Image from 'next/image';

export default function PushHeader({
  content,
}: {
  content: { icon: string; message: string; subMessage: string };
}) {
  return (
    <div className="mt-[50px] flex flex-col items-center justify-center gap-3 px-5 pb-10 pt-5">
      <Image src={content.icon} alt="아이콘" width={60} height={60} />
      <p className="whitespace-pre-line text-t1 text-gray-strong">
        {content.message}
      </p>
      <p className="whitespace-pre-line text-center text-b2 text-gray-neutral">
        {content.subMessage}
      </p>
    </div>
  );
}
