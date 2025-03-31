"use client";

import Image from "next/image";
import { useState } from "react";

interface DetailGoal {
	id: number;
	title: string;
	completed: boolean;
}

interface DetailGoalsProps {
	taskId: number;
}

export default function DetailGoals({ taskId }: DetailGoalsProps) {
	const [detailGoals, setDetailGoals] = useState<DetailGoal[]>([]);
	const [isAddingGoal, setIsAddingGoal] = useState(false);
	const [newGoalTitle, setNewGoalTitle] = useState("");

	const handleAddGoal = () => {
		setIsAddingGoal(true);
	};

	const handleSaveGoal = () => {
		if (newGoalTitle.trim()) {
			const newGoal: DetailGoal = {
				id: Date.now(),
				title: newGoalTitle,
				completed: false,
			};
			setDetailGoals([...detailGoals, newGoal]);
			setNewGoalTitle("");
			setIsAddingGoal(false);
		}
	};

	const handleCancelAdd = () => {
		setNewGoalTitle("");
		setIsAddingGoal(false);
	};

	const handleToggleComplete = (goalId: number) => {
		setDetailGoals(
			detailGoals.map((goal) =>
				goal.id === goalId ? { ...goal, completed: !goal.completed } : goal,
			),
		);
	};

	return (
		<div
			className="w-full p-4"
			style={{
				borderRadius: "var(--16, 16px)",
				background:
					"linear-gradient(180deg, rgba(121, 121, 235, 0.30) 0%, rgba(121, 121, 235, 0.10) 29.17%, rgba(121, 121, 235, 0.00) 100%), var(--Component-Gray-Primary, #17191F)",
			}}
		>
			<div className="flex items-center justify-between mb-4">
				<h2 className="s1 text-gray-strong">세부 목표</h2>
				<button
					onClick={handleAddGoal}
					aria-label="세부 목표 추가"
					className="flex items-center justify-center"
				>
					<Image
						src="/icons/immersion/plus.svg"
						alt="추가"
						width={24}
						height={24}
					/>
				</button>
			</div>

			{detailGoals.length === 0 && !isAddingGoal ? (
				<div className="py-2 text-start text-gray-disabled">
					<p className="text-b2">세부 목표를 추가하세요</p>
				</div>
			) : (
				<ul className="space-y-2">
					{detailGoals.map((goal) => (
						<li key={goal.id} className="flex items-center">
							<input
								type="checkbox"
								checked={goal.completed}
								onChange={() => handleToggleComplete(goal.id)}
								className="mr-3 h-5 w-5 rounded border-gray-300"
							/>
							<span
								className={`text-b3 ${goal.completed ? "line-through text-gray-neutral" : "text-gray-strong"}`}
							>
								{goal.title}
							</span>
						</li>
					))}
				</ul>
			)}

			{isAddingGoal && (
				<div className="mt-3">
					<input
						type="text"
						value={newGoalTitle}
						onChange={(e) => setNewGoalTitle(e.target.value)}
						placeholder="세부 목표를 입력하세요"
						className="w-full rounded border border-component-gray-tertiary bg-component-gray-secondary p-2 text-gray-strong mb-2"
						autoFocus
					/>
					<div className="flex justify-end space-x-2">
						<button
							onClick={handleCancelAdd}
							className="text-c2 text-gray-neutral px-3 py-1 rounded"
						>
							취소
						</button>
						<button
							onClick={handleSaveGoal}
							className="text-c2 bg-component-gray-secondary text-gray-strong px-3 py-1 rounded"
						>
							추가
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
