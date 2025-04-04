"use client";

import AllTaskItem from "@/app/(protected)/(root)/_components/AllTaskItem";
import TaskFilterDropdown from "@/app/(protected)/(root)/_components/TaskFilterDropdown";
import type { Task } from "@/types/task";
import { useCallback, useMemo, useState } from "react";

// 유형별 우선순위 정의 (WeeklyTasksPage.tsx에서 가져옴)
const CATEGORY_PRIORITY: Record<string, number> = {
	과제: 1,
	"그림∙디자인": 2,
	글쓰기: 3,
	공부: 4,
	프로그래밍: 5,
	운동: 6,
};

interface AllTasksTabProps {
	inProgressTasks: Task[];
	todayTasks: Task[];
	weeklyTasks: Task[];
	futureTasks: Task[];
	onTaskClick: (task: Task) => void;
	onDeleteTask: (taskId: number) => void;
}

const AllTasksTab: React.FC<AllTasksTabProps> = ({
	inProgressTasks,
	todayTasks,
	weeklyTasks,
	futureTasks,
	onTaskClick,
	onDeleteTask,
}) => {
	// 필터 옵션 정의
	const filterOptions = [
		{ id: "due-asc", label: "마감일 가까운 순" },
		{ id: "duration-desc", label: "소요시간 긴 순" },
		{ id: "category", label: "마감 유형별" },
	];

	const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

	// 소요시간 처리 함수 (시간을 분 단위로 변환)
	const getDurationInMinutes = useCallback((task: Task): number => {
		// 추정시간 계산 (context.ts의 estimatedHour, estimatedMinute와 연계)
		const estimatedHour = task.estimatedHour
			? Number.parseInt(task.estimatedHour, 10)
			: 0;
		const estimatedMinute = task.estimatedMinute
			? Number.parseInt(task.estimatedMinute, 10)
			: 0;

		// timeRequired에서 시간 추출 (fallback)
		if (estimatedHour === 0 && estimatedMinute === 0 && task.timeRequired) {
			const match = task.timeRequired?.match(/(\d+)시간/);
			if (match?.[1]) {
				return Number.parseInt(match[1], 10) * 60;
			}
		}

		return estimatedHour * 60 + estimatedMinute;
	}, []);

	// 마감 유형별로 태스크를 그룹화하는 함수
	const groupTasksByCategory = useCallback((tasks: Task[]) => {
		const grouped: Record<string, Task[]> = {};

		for (const task of tasks) {
			// persona.taskKeywordsCombination.taskType.name에서 카테고리 정보 가져오기
			const category =
				task.persona?.taskKeywordsCombination?.taskType?.name || "기타";

			if (!grouped[category]) {
				grouped[category] = [];
			}
			grouped[category].push(task);
		}

		// 카테고리 우선순위에 따라 정렬
		const sortedCategories = Object.keys(grouped).sort((a, b) => {
			const aPriority = CATEGORY_PRIORITY[a] || 999;
			const bPriority = CATEGORY_PRIORITY[b] || 999;
			return aPriority - bPriority;
		});

		return { grouped, sortedCategories };
	}, []);

	// 필터에 따른 정렬 함수
	const sortTasksByFilter = useCallback(
		(tasks: Task[], filterId: string): Task[] => {
			return tasks.sort((a, b) => {
				const aDate = a.dueDatetime
					? new Date(a.dueDatetime)
					: a.dueDate
						? new Date(a.dueDate)
						: new Date();

				const bDate = b.dueDatetime
					? new Date(b.dueDatetime)
					: b.dueDate
						? new Date(b.dueDate)
						: new Date();

				const aDuration = getDurationInMinutes(a);
				const bDuration = getDurationInMinutes(b);

				switch (filterId) {
					case "due-asc": {
						// 마감일 가까운 순
						return aDate.getTime() - bDate.getTime();
					}
					case "duration-desc": {
						// 소요시간 긴 순
						// 소요시간이 같으면 마감일 가까운 순, 마감일도 같으면 이름순
						if (bDuration === aDuration) {
							if (aDate.getTime() === bDate.getTime()) {
								return (a.title || "").localeCompare(b.title || "");
							}
							return aDate.getTime() - bDate.getTime();
						}
						return bDuration - aDuration;
					}
					case "category": {
						// 마감 유형별
						// persona.taskKeywordsCombination.taskType.name에 카테고리 정보가 있음
						const aCategory =
							a.persona?.taskKeywordsCombination?.taskType?.name || "기타";
						const bCategory =
							b.persona?.taskKeywordsCombination?.taskType?.name || "기타";

						const aCategoryPriority = CATEGORY_PRIORITY[aCategory] || 999;
						const bCategoryPriority = CATEGORY_PRIORITY[bCategory] || 999;

						// 같은 카테고리면 마감일 기준으로 정렬
						if (aCategoryPriority === bCategoryPriority) {
							return aDate.getTime() - bDate.getTime();
						}
						return aCategoryPriority - bCategoryPriority;
					}
					default: {
						return aDate.getTime() - bDate.getTime();
					}
				}
			});
		},
		[getDurationInMinutes],
	);

	// 모든 작업을 하나의 배열로 병합 (진행 중인 작업은 제외할 수 있습니다)
	const allTasksCombined = useMemo(() => {
		if (selectedFilter.id === "category") {
			// 카테고리별 정렬 시 진행 중인 작업도 포함
			return [
				...inProgressTasks,
				...todayTasks,
				...weeklyTasks,
				...futureTasks,
			];
		}

		return [...todayTasks, ...weeklyTasks, ...futureTasks];
	}, [
		inProgressTasks,
		todayTasks,
		weeklyTasks,
		futureTasks,
		selectedFilter.id,
	]);

	// 정렬된 오늘 작업
	const sortedTodayTasks = useMemo(() => {
		const tasks = [...todayTasks];
		return sortTasksByFilter(tasks, selectedFilter.id);
	}, [todayTasks, selectedFilter.id, sortTasksByFilter]);

	// 정렬된 이번주 작업
	const sortedWeeklyTasks = useMemo(() => {
		const tasks = [...weeklyTasks];
		return sortTasksByFilter(tasks, selectedFilter.id);
	}, [weeklyTasks, selectedFilter.id, sortTasksByFilter]);

	// 정렬된 이후 할일
	const sortedFutureTasks = useMemo(() => {
		const tasks = [...futureTasks];
		return sortTasksByFilter(tasks, selectedFilter.id);
	}, [futureTasks, selectedFilter.id, sortTasksByFilter]);

	// 정렬된 진행 중 작업
	const sortedInProgressTasks = useMemo(() => {
		const tasks = [...inProgressTasks];
		return sortTasksByFilter(tasks, selectedFilter.id);
	}, [inProgressTasks, selectedFilter.id, sortTasksByFilter]);

	// 카테고리별 분류를 위한 데이터 가공
	const groupedTasksData = useMemo(() => {
		if (selectedFilter.id === "category") {
			return groupTasksByCategory(allTasksCombined);
		}
		return {
			grouped: {} as Record<string, Task[]>,
			sortedCategories: [] as string[],
		};
	}, [allTasksCombined, selectedFilter.id, groupTasksByCategory]);

	const handleFilterChange = (option: (typeof filterOptions)[0]) => {
		setSelectedFilter(option);
	};

	return (
		<>
			<div className="flex justify-end mb-4">
				<TaskFilterDropdown
					options={filterOptions}
					defaultOptionId="due-asc"
					onChange={handleFilterChange}
				/>
			</div>

			{selectedFilter.id === "category" ? (
				// 카테고리별 정렬일 때는 카테고리로만 분류
				<>
					{groupedTasksData.sortedCategories.map((category) => (
						<div key={category} className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">{category}</h3>
							{groupedTasksData.grouped[category].map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					))}
				</>
			) : (
				// 다른 정렬 옵션일 때는 기존 구조 유지
				<>
					{sortedInProgressTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">진행 중</h3>
							{sortedInProgressTasks.map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					)}

					{sortedTodayTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">오늘</h3>
							{sortedTodayTasks.map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					)}

					{sortedWeeklyTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">이번주</h3>
							{sortedWeeklyTasks.map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					)}

					{sortedFutureTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">이후 할일</h3>
							{sortedFutureTasks.map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default AllTasksTab;
