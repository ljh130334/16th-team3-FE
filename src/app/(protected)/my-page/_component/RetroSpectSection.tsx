import RetrospectCard from "./RetroSpectCard";

import Heart1 from "@public/icons/mypage/satisfactions/Heart.svg";
import Heart2 from "@public/icons/mypage/satisfactions/Heart2.svg";
import Heart3 from "@public/icons/mypage/satisfactions/Heart3.svg";
import Heart4 from "@public/icons/mypage/satisfactions/Heart4.svg";
import Heart5 from "@public/icons/mypage/satisfactions/Heart5.svg";

import Thunder1 from "@public/icons/mypage/concentrations/Thunder.svg";
import Thunder2 from "@public/icons/mypage/concentrations/Thunder2.svg";
import Thunder3 from "@public/icons/mypage/concentrations/Thunder3.svg";
import Thunder4 from "@public/icons/mypage/concentrations/Thunder4.svg";
import Thunder5 from "@public/icons/mypage/concentrations/Thunder5.svg";

interface RetrospectSectionProps {
	satisfactionPercentage: number;
	concentrationPercentage: number;
}

export default function RetrospectSection({
	satisfactionPercentage,
	concentrationPercentage,
}: RetrospectSectionProps) {
	const SATISFACTION_RANGES = [
		{
			min: 81,
			max: 100,
			text: "완전 만족해요",
			style: "bg-hologram bg-clip-text text-transparent",
			icon: Heart5,
		},
		{
			min: 61,
			max: 80,
			text: "꽤 만족해요",
			style: "text-primary",
			icon: Heart4,
		},
		{
			min: 41,
			max: 60,
			text: "보통이에요",
			style: "text-line-accent",
			icon: Heart3,
		},
		{
			min: 21,
			max: 40,
			text: "조금 아쉬워요",
			style: "text-component-accent-red",
			icon: Heart2,
		},
		{
			min: 0,
			max: 20,
			text: "많이 아쉬워요",
			style: "text-component-accent-red",
			icon: Heart1,
		},
	];

	const CONCENTRATION_RANGES = [
		{
			min: 81,
			max: 100,
			text: "완전 집중해요",
			style: "bg-hologram bg-clip-text text-transparent",
			icon: Thunder5,
		},
		{
			min: 61,
			max: 80,
			text: "가끔 끊겨요",
			style: "text-primary",
			icon: Thunder4,
		},
		{
			min: 41,
			max: 60,
			text: "중간중간 산만해요",
			style: "text-line-accent",
			icon: Thunder3,
		},
		{
			min: 21,
			max: 40,
			text: "계속 방해돼요",
			style: "text-component-accent-red",
			icon: Thunder2,
		},
		{
			min: 0,
			max: 20,
			text: "거의 집중 못해요",
			style: "text-component-accent-red",
			icon: Thunder1,
		},
	];

	const getSatisfactionMessageWithStyle = (percentage: number) => {
		const range = SATISFACTION_RANGES.find(
			(r) => percentage >= r.min && percentage <= r.max,
		);
		return range || { text: "", style: "", icon: "" };
	};

	const getConcentrationMessageWithStyle = (percentage: number) => {
		const range = CONCENTRATION_RANGES.find(
			(r) => percentage >= r.min && percentage <= r.max,
		);
		return range || { text: "", style: "", icon: "" };
	};

	return (
		<div className="px-5">
			<div className="mb-4 text-s2 text-gray-normal">나의 회고</div>
			<div className="flex items-center justify-between gap-3">
				<RetrospectCard
					title="몰입 만족도"
					percentage={satisfactionPercentage}
					icon={getSatisfactionMessageWithStyle(satisfactionPercentage).icon}
					messageStyle={
						getSatisfactionMessageWithStyle(satisfactionPercentage).style
					}
					messageText={
						getSatisfactionMessageWithStyle(satisfactionPercentage).text
					}
				/>
				<RetrospectCard
					title="몰입 집중도"
					percentage={concentrationPercentage}
					icon={getConcentrationMessageWithStyle(concentrationPercentage).icon}
					messageStyle={
						getConcentrationMessageWithStyle(concentrationPercentage).style
					}
					messageText={
						getConcentrationMessageWithStyle(concentrationPercentage).text
					}
				/>
			</div>
		</div>
	);
}
