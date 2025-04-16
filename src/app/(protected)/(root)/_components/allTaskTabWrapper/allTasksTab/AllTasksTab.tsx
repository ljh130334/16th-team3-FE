"use client";

import AllTaskItem from "@/app/(protected)/(root)/_components/AllTaskItem";
import TaskFilterDropdown from "@/app/(protected)/(root)/_components/TaskFilterDropdown";
import type { Task } from "@/types/task";
import { useCallback, useMemo, useState } from "react";

// 유형별 우선순위 정의
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
						// 마감일 가까운 순, 마감일이 같으면 이름순
						if (aDate.getTime() === bDate.getTime()) {
							return (a.title || "").localeCompare(b.title || "");
						}
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
						const aCategory =
							a.persona?.taskKeywordsCombination?.taskType?.name || "기타";
						const bCategory =
							b.persona?.taskKeywordsCombination?.taskType?.name || "기타";

						const aCategoryPriority = CATEGORY_PRIORITY[aCategory] || 999;
						const bCategoryPriority = CATEGORY_PRIORITY[bCategory] || 999;

						// 같은 카테고리면 마감일 기준으로 정렬, 마감일도 같으면 이름순
						if (aCategoryPriority === bCategoryPriority) {
							if (aDate.getTime() === bDate.getTime()) {
								return (a.title || "").localeCompare(b.title || "");
							}
							return aDate.getTime() - bDate.getTime();
						}
						return aCategoryPriority - bCategoryPriority;
					}
					default: {
						// 기본값도 마감일 가까운 순, 마감일이 같으면 이름순
						if (aDate.getTime() === bDate.getTime()) {
							return (a.title || "").localeCompare(b.title || "");
						}
						return aDate.getTime() - bDate.getTime();
					}
				}
			});
		},
		[getDurationInMinutes],
	);

	// 마감 유형별로 태스크를 그룹화하는 함수
	const groupTasksByCategory = useCallback(
		(tasks: Task[]) => {
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

			// 각 카테고리 내에서 마감일 가까운 순으로 정렬
			for (const category of sortedCategories) {
				grouped[category] = sortTasksByFilter(grouped[category], "due-asc");
			}

			return { grouped, sortedCategories };
		},
		[sortTasksByFilter],
	);

	const allTasksCombined = useMemo(() => {
		if (selectedFilter.id === "category") {
			return [
				...inProgressTasks,
				...todayTasks,
				...weeklyTasks,
				...futureTasks,
			];
		}

		return [...inProgressTasks, ...todayTasks, ...weeklyTasks, ...futureTasks];
	}, [
		inProgressTasks,
		todayTasks,
		weeklyTasks,
		futureTasks,
		selectedFilter.id,
	]);

	// 진행 중인 작업 분류
	const categorizedInProgressTasks = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		// 이번주의 월요일 찾기
		const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
		const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		const mondayOfThisWeek = new Date(today);
		mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);

		// 이번주의 일요일 찾기
		const sundayOfThisWeek = new Date(mondayOfThisWeek);
		sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
		sundayOfThisWeek.setHours(23, 59, 59, 999);

		// 오늘, 이번주, 이후 할일로 분류
		const todayIPTasks: Task[] = [];
		const weeklyIPTasks: Task[] = [];
		const futureIPTasks: Task[] = [];

		for (const task of inProgressTasks) {
			const taskDueDate = task.dueDatetime
				? new Date(task.dueDatetime)
				: task.dueDate
					? new Date(task.dueDate)
					: null;

			if (!taskDueDate) {
				// 마감일이 없으면 오늘로 분류
				todayIPTasks.push(task);
				continue;
			}

			const taskDateOnly = new Date(taskDueDate);
			taskDateOnly.setHours(0, 0, 0, 0);

			if (taskDateOnly.getTime() === today.getTime()) {
				// 오늘인 경우
				todayIPTasks.push(task);
			} else if (taskDateOnly < sundayOfThisWeek && taskDateOnly >= tomorrow) {
				// 내일부터 이번주 일요일까지
				weeklyIPTasks.push(task);
			} else if (taskDateOnly >= sundayOfThisWeek) {
				// 이번주 이후
				futureIPTasks.push(task);
			} else {
				// 지난 날짜의 경우 오늘로 분류
				todayIPTasks.push(task);
			}
		}

		return {
			todayIPTasks,
			weeklyIPTasks,
			futureIPTasks,
		};
	}, [inProgressTasks]);

	// 정렬된 오늘 작업
	const combinedTodayTasks = useMemo(() => {
		const combined = [
			...categorizedInProgressTasks.todayIPTasks,
			...todayTasks,
		];
		return sortTasksByFilter(combined, selectedFilter.id);
	}, [
		categorizedInProgressTasks.todayIPTasks,
		todayTasks,
		selectedFilter.id,
		sortTasksByFilter,
	]);

	// 정렬된 이번주 작업
	const combinedWeeklyTasks = useMemo(() => {
		const combined = [
			...categorizedInProgressTasks.weeklyIPTasks,
			...weeklyTasks,
		];
		return sortTasksByFilter(combined, selectedFilter.id);
	}, [
		categorizedInProgressTasks.weeklyIPTasks,
		weeklyTasks,
		selectedFilter.id,
		sortTasksByFilter,
	]);

	// 정렬된 이후 할일
	const combinedFutureTasks = useMemo(() => {
		const combined = [
			...categorizedInProgressTasks.futureIPTasks,
			...futureTasks,
		];
		return sortTasksByFilter(combined, selectedFilter.id);
	}, [
		categorizedInProgressTasks.futureIPTasks,
		futureTasks,
		selectedFilter.id,
		sortTasksByFilter,
	]);

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
				// 다른 정렬 옵션일 때는 오늘/이번주/이후 할일로 구조 변경
				<>
					{combinedTodayTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">오늘</h3>
							{/* 오늘 마감인 작업 */}
							{combinedTodayTasks.map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					)}

					{combinedWeeklyTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">이번주</h3>
							{/* 이번주 마감인 작업 */}
							{combinedWeeklyTasks.map((task) => (
								<AllTaskItem
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onDelete={onDeleteTask}
								/>
							))}
						</div>
					)}

					{combinedFutureTasks.length > 0 && (
						<div className="mb-6">
							<h3 className="s3 mb-2 text-text-neutral">이후 할일</h3>
							{/* 이후 마감인 작업 */}
							{combinedFutureTasks.map((task) => (
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
