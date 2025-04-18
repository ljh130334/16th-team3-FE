interface ReminderTimesListProps {
	times: { index: number; time: string }[];
}

export default function ReminderTimesList({ times }: ReminderTimesListProps) {
	return (
		<div className="flex flex-col gap-3 px-[19.5px]">
			{times.map((item) => (
				<div
					key={item.index}
					className="flex items-center text-t2 bg-component-gray-primary rounded-[12px] text-gray-neutral px-5 py-4"
				>
					<span className="t3 text-component-accent-primary mr-2.5">
						{item.index}
					</span>
					{item.time}
				</div>
			))}
		</div>
	);
}
