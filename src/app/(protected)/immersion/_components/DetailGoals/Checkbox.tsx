import Image from "next/image";

interface CheckboxProps {
	checked?: boolean;
	onChange?: () => void;
	disabled?: boolean;
}

export const GradientCheckbox = () => (
	<div className="w-5 h-5 relative flex-shrink-0">
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<title>빈 체크박스</title>
			<rect
				x="0.5"
				y="0.5"
				width="19"
				height="19"
				rx="3.5"
				stroke="url(#paint0_linear_4484_9114)"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_4484_9114"
					x1="19.2739"
					y1="20.1709"
					x2="0.285921"
					y2="20.6621"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#DDD9F8" />
					<stop offset="0.273644" stopColor="#E4E4FF" />
					<stop offset="0.610199" stopColor="#CCE4FF" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

export const CheckboxWithGradientBorder = ({
	checked,
	onChange,
	disabled = false,
}: CheckboxProps) => (
	<div className="w-5 h-5 relative flex-shrink-0">
		{checked ? (
			<div className="absolute inset-0 flex items-center justify-center">
				<label className="w-5 h-5 relative flex-shrink-0 cursor-pointer">
					<input
						type="checkbox"
						checked={checked}
						onChange={onChange}
						className="absolute inset-0 w-full h-full opacity-0 z-10"
						aria-label="세부 목표 완료 체크"
						disabled={disabled}
					/>

					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<title>완료된 체크박스</title>
						<rect
							width="20"
							height="20"
							rx="4"
							fill="url(#paint0_linear_completed)"
							style={{ opacity: 0.6 }}
						/>
						<path
							d="M6 10L9 13L14 7"
							stroke="#1F2127"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_completed"
								x1="19.2739"
								y1="20.1709"
								x2="0.285921"
								y2="20.6621"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#DDD9F8" />
								<stop offset="0.273644" stopColor="#E4E4FF" />
								<stop offset="0.610199" stopColor="#CCE4FF" />
							</linearGradient>
						</defs>
					</svg>
				</label>
			</div>
		) : (
			<>
				<input
					type="checkbox"
					checked={checked}
					onChange={onChange}
					className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
					aria-label="세부 목표 완료 체크"
					disabled={disabled}
				/>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<title>체크되지 않은 체크박스</title>
					<rect
						x="0.5"
						y="0.5"
						width="19"
						height="19"
						rx="3.5"
						stroke="url(#paint0_linear_4484_9114)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_4484_9114"
							x1="19.2739"
							y1="20.1709"
							x2="0.285921"
							y2="20.6621"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#DDD9F8" />
							<stop offset="0.273644" stopColor="#E4E4FF" />
							<stop offset="0.610199" stopColor="#CCE4FF" />
						</linearGradient>
					</defs>
				</svg>
			</>
		)}
	</div>
);
