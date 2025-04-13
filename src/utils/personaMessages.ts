// 메시지 타입 정의
export type TimeMessageType =
	| "start" // 시작할 때
	| "dailyMorning" // 매일 오전 9시
	| "midPoint" // 중간 지점
	| "day1Before" // 마감 24시간 전
	| "hour1Before" // 1시간 전
	| "min10Before"; // 10분 전

// 각 페르소나별 시간대 메시지를 저장하는 인터페이스
interface PersonaTimeMessages {
	start: string;
	dailyMorning: string;
	midPoint: string;
	day1Before: string;
	hour1Before: string;
	min10Before: string;
}

// 모든 페르소나에 대한 메시지 맵
type PersonaMessagesMap = {
	[personaId: string]: PersonaTimeMessages;
};

// 페르소나별 메시지 정의
export const personaMessages: PersonaMessagesMap = {
	"1": {
		start: "출발 준비 끝! 첫 장부터 달려봐요!",
		dailyMorning: "기관차는 멈추지 않아요! 오늘도 전력 질주!",
		midPoint: "절반 왔어요! 남은 시간, 더 빨리 달려볼까요?",
		day1Before: "마감 하루 전! 남은 시간, 더 빨리 달려볼까요?",
		hour1Before: "마지막 1시간! 막판 스퍼트 올려서 전력 질주!",
		min10Before: "마지막 10분! 막판 스퍼트 올려서 전력 질주!",
	},

	"2": {
		start: "첫 문장이 쉽진 않죠? 한 줄만 써봐요!",
		dailyMorning: "오늘도 한 줄 한 줄, 마감까지 불태워봐요!",
		midPoint: "절반 왔어요! 마감까지 계속 써볼까요?",
		day1Before: "마감 하루 전! 마감까지 계속 써볼까요?",
		hour1Before: "마지막 1시간! 손가락에 불나게 스퍼트 ON!",
		min10Before: "마지막 10분! 손가락에 불나게 스퍼트 ON!",
	},

	"3": {
		start: "심박수 올릴 시간! 바로 몸부터 풀어볼까요?",
		dailyMorning: "오늘도 심박수 폭주 예약! 한 세트라도 해봐요!️‍",
		midPoint: "절반 왔어요! 남은 세트도 끝까지 가요!",
		day1Before: "마감 하루 전! 남은 세트도 끝까지 가요!",
		hour1Before: "마지막 1시간! 막판 스퍼트로 심박수 올려요!",
		min10Before: "마지막 10분! 막판 스퍼트로 심박수 올려요!",
	},

	"4": {
		start: "시동 걸었어요! 첫 줄부터 전력 질주!",
		dailyMorning: "신호는 초록불! 오늘도 첫 커밋부터 스피드업!",
		midPoint: "절반 왔어요! 디버깅 없이 풀가속 유지!",
		day1Before: "마감 하루 전! 디버깅 없이 풀가속 유지!",
		hour1Before: "마지막 1시간! 배포까지 막판 스퍼트 ON!",
		min10Before: "마지막 10분! 배포까지 막판 스퍼트 ON!",
	},

	"5": {
		start: "작업이랑 눈 마주쳤어요! 마감과의 전쟁 시작!",
		dailyMorning: "마감 요정 출근 완료! 손만 대도 완성도 UP!",
		midPoint: "절반 왔어요! 마감까지 스피드 올려봐요!",
		day1Before: "마감 하루 전! 마감까지 스피드 올려봐요!",
		hour1Before: "마지막 1시간! 마지막 터치까지 스퍼트 ON!",
		min10Before: "마지막 10분! 마지막 터치까지 스퍼트 ON!",
	},

	"6": {
		start: "한 줄만 써봐요! 표지만 완성은 안 돼요!",
		dailyMorning: "과제는 준비 됐어요. 오늘도 조금만 해볼까요?",
		midPoint: "절반 왔어요! 남은 시간도 같이 달려봐요!",
		day1Before: "마감 하루 전! 남은 시간도 같이 달려봐요!",
		hour1Before: "마지막 1시간! 스퍼트 올려서 눈물 닦고 끝까지!",
		min10Before: "마지막 10분! 스퍼트 올려서 눈물 닦고 끝까지!",
	},

	"7": {
		start: "공부도 비트가 중요해요! 첫 페이지부터 출발~",
		dailyMorning: "부릉! 브레인 워밍업하러 가볼까요?",
		midPoint: "절반 왔어요! 남은 시간도 이 기세로 신나게!",
		day1Before: "마감 하루 전! 남은 시간도 이 기세로 신나게!",
		hour1Before: "마지막 1시간! 하이텐션으로 스퍼트 ON!",
		min10Before: "마지막 10분! 하이텐션으로 스퍼트 ON!",
	},

	"8": {
		start: "비트 타며 한 문장씩 써볼까요?",
		dailyMorning: "글감도 리듬도 준비 완료! 한 줄씩 채워봐요!",
		midPoint: "절반 왔어요! 이대로 남은 글도 계속 써요!",
		day1Before: "마감 하루 전! 이대로 남은 글도 계속 써요!",
		hour1Before: "마지막 1시간! 스퍼트 ON! 비트도 최대로!",
		min10Before: "마지막 10분! 스퍼트 ON! 비트도 최대로!",
	},

	"9": {
		start: "음악 켰어요! 첫 세트부터 몸 풀어볼까요?",
		dailyMorning: "오늘도 신나게! 한 세트만 워밍업 시작해봐요!",
		midPoint: "절반 왔어요! 펌핑하기 딱 좋은 타이밍!",
		day1Before: "마감 하루 전! 펌핑하기 딱 좋은 타이밍!",
		hour1Before: "마지막 1시간! 최고 컨디션으로 끝까지 스퍼트!",
		min10Before: "마지막 10분! 최고 컨디션으로 끝까지 스퍼트!",
	},

	"10": {
		start: "오늘의 첫 트랙은 어떤 코드인가요?",
		dailyMorning: "오늘도 완벽한 코드 믹싱, 첫 커밋 스타트!",
		midPoint: "절반 왔어요! 이 흐름대로, 완벽한 코드 완성!",
		day1Before: "마감 하루 전! 이 흐름대로, 완벽한 코드 완성!",
		hour1Before: "마지막 1시간! 키보드 풀파워로 스퍼트 올려요!",
		min10Before: "마지막 10분! 키보드 풀파워로 스퍼트 올려요!",
	},

	"11": {
		start: "저장은 기본! 첫 프레임부터 잊지말기!",
		dailyMorning: "손끝의 리듬감을 살려, 오늘도 한 컷씩 GO!",
		midPoint: "절반 왔어요! 단축키 리듬 놓치지 마요!",
		day1Before: "마감 하루 전! 단축키 리듬 놓치지 마요!",
		hour1Before: "마지막 1시간! 스퍼트 올려서 단축키 폭풍 클릭!",
		min10Before: "마지막 10분! 스퍼트 올려서 단축키 폭풍 클릭!",
	},

	"12": {
		start: "과탑 본능 발동! 첫 페이지부터 씹어먹어요!",
		dailyMorning: "과탑 DNA 깨어나는 중! 오늘도 앞서가요!",
		midPoint: "절반 왔어요! 지금 텐션대로라면 과탑 각!",
		day1Before: "마감 하루 전! 지금 텐션대로라면 과탑 각!",
		hour1Before: "마지막 1시간! 에너지 풀가동! 막판 스퍼트!",
		min10Before: "마지막 10분! 에너지 풀가동! 막판 스퍼트!",
	},

	"13": {
		start: "카페인 충전 완료! 몰입할 준비됐나요?",
		dailyMorning: "공부도 분위기 있게, 오늘의 몰입 시작!",
		midPoint: "절반 왔어요! 재즈와 함께 흐름을 이어가요.",
		day1Before: "마감 하루 전! 재즈와 함께 흐름을 이어가요.",
		hour1Before: "마지막 1시간! 집중의 온도를 끌어올려 스퍼트!",
		min10Before: "마지막 10분! 집중의 온도를 끌어올려 스퍼트!",
	},

	"14": {
		start: "커피 한 모금, 첫 문장을 적어볼까요?",
		dailyMorning: "따뜻한 재즈와 함께, 오늘도 한 줄씩 써봐요.",
		midPoint: "절반 왔어요! 글의 향기가 깊어지고 있어요.",
		day1Before: "마감 하루 전! 글의 향기가 깊어지고 있어요.",
		hour1Before: "마지막 1시간! 흐름을 살려 마지막까지 스퍼트!",
		min10Before: "마지막 10분! 흐름을 살려 마지막까지 스퍼트!",
	},

	"15": {
		start: "몸의 소리를 따라 부드럽게 시작해볼까요?",
		dailyMorning: "파도처럼 부드럽게, 근육을 깨우며 움직여봐요.",
		midPoint: "절반 왔어요! 몸과의 대화에 더 집중해봐요.",
		day1Before: "마감 하루 전! 몸과의 대화에 더 집중해봐요.",
		hour1Before: "마지막 1시간! 감각을 깨워 끝까지 스퍼트!",
		min10Before: "마지막 10분! 감각을 깨워 끝까지 스퍼트!",
	},

	"16": {
		start: "따뜻한 커피 한 잔과 함께, 첫 줄을 채워볼까요?",
		dailyMorning: "재즈 선율과 함께, 오늘의 첫 코드를 채워봐요.",
		midPoint: "절반 왔어요! 마지막까지 코드에 몰입해봐요.",
		day1Before: "마감 하루 전! 마지막까지 코드에 몰입해봐요.",
		hour1Before: "마지막 1시간! 집중을 끌어올려 스퍼트 ON!",
		min10Before: "마지막 10분! 집중을 끌어올려 스퍼트 ON!",
	},

	"17": {
		start: "첫 터치의 순간, 감각을 따라 그려봐요!",
		dailyMorning: "차분한 손길로, 오늘의 작업을 시작해볼까요?",
		midPoint: "절반 왔어요! 디테일도 섬세하게 다듬어봐요.",
		day1Before: "마감 하루 전! 디테일도 섬세하게 다듬어봐요.",
		hour1Before: "마지막 1시간! 완성도 높이며 스퍼트 올려봐요!",
		min10Before: "마지막 10분! 완성도 높이며 스퍼트 올려봐요!",
	},

	"18": {
		start: "잔잔한 재즈와 함께, 과제에 몰입해볼까요?",
		dailyMorning: "따뜻한 커피처럼, 과제도 한 모금씩 천천히!",
		midPoint: "절반 왔어요! 낭만을 담아 끝까지 나아가요.",
		day1Before: "마감 하루 전! 낭만을 담아 끝까지 나아가요.",
		hour1Before: "마지막 1시간! 깊이 몰입하며 끝까지 스퍼트!",
		min10Before: "마지막 10분! 깊이 몰입하며 끝까지 스퍼트!",
	},

	"19": {
		start: "소리 없이 등장… 공부를 시작할 시간이에요.",
		dailyMorning: "도서관 문이 열렸어요. 오늘도 몰입해볼까요?",
		midPoint: "절반 왔어요! 남은 페이지도 조용히 돌파!",
		day1Before: "마감 하루 전! 남은 페이지도 조용히 돌파!",
		hour1Before: "마지막 1시간! 소리 없이 완벽하게 스퍼트 ON!",
		min10Before: "마지막 10분! 소리 없이 완벽하게 스퍼트 ON!",
	},

	"20": {
		start: "키보드 소리만 들리는 시간, 첫 줄을 써볼까요?",
		dailyMorning: "한 단어씩, 오늘도 차분히 채워볼까요?",
		midPoint: "절반 왔어요! 한 줄씩 차곡차곡 마무리까지!",
		day1Before: "마감 하루 전! 한 줄씩 차곡차곡 마무리까지!",
		hour1Before: "마지막 1시간! 조용하지만 강력한 막판 스퍼트!",
		min10Before: "마지막 10분! 조용하지만 강력한 막판 스퍼트!",
	},

	"21": {
		start: "조용한 집중력으로, 첫 세트 준비 완료!",
		dailyMorning: "소리 없이 쌓이는 힘, 오늘도 시작해볼까요?",
		midPoint: "절반 왔어요! 지금 템포 그대로 마지막까지!",
		day1Before: "마감 하루 전! 지금 템포 그대로 마지막까지!",
		hour1Before: "마지막 1시간! 한 번 더, 묵묵히 스퍼트!",
		min10Before: "마지막 10분! 한 번 더, 묵묵히 스퍼트!",
	},

	"22": {
		start: "어둠 속에서 코드 한 줄, 차분히 시작해볼까요?",
		dailyMorning: "오늘도 묵묵히, 집중하며 한 줄씩 채워볼까요?",
		midPoint: "절반 왔어요! 키보드 ASMR, 계속 이어가요.",
		day1Before: "마감 하루 전! 키보드 ASMR, 계속 이어가요.",
		hour1Before: "마지막 1시간! 스퍼트 올려 완벽한 코드로!",
		min10Before: "마지막 10분! 스퍼트 올려 완벽한 코드로!",
	},

	"23": {
		start: "집중할 시간이에요. 한 획씩 정성스럽게!",
		dailyMorning: "조용히 몰입하며, 오늘도 디테일을 쌓아봐요.",
		midPoint: "절반 왔어요! 마무리까지 깊게 몰입해봐요.",
		day1Before: "마감 하루 전! 마무리까지 깊게 몰입해봐요.",
		hour1Before: "마지막 1시간! 정교한 터치로 마무리 스퍼트!",
		min10Before: "마지막 10분! 정교한 터치로 마무리 스퍼트!",
	},

	"24": {
		start: "A+을 향한 첫 걸음! 조용히 몰입 시작해볼까요?",
		dailyMorning: "묵묵히 노력하면 A+로 돌아와요. 오늘도 출발!",
		midPoint: "절반 왔어요! A+을 향해 한 걸음 더!",
		day1Before: "마감 하루 전! A+을 향해 한 걸음 더!",
		hour1Before: "마지막 1시간! 소리 없이 강하게 스퍼트 ON!",
		min10Before: "마지막 10분! 소리 없이 강하게 스퍼트 ON!",
	},
};

// 예상 소요시간에 따라 적절한 메시지 타입을 결정하는 함수
export function determineMessageType(
	dueDate: Date,
	estimatedHours: number,
	now: Date = new Date(),
): TimeMessageType {
	const timeDiff = dueDate.getTime() - now.getTime();
	const hoursDiff = timeDiff / (1000 * 60 * 60);

	// 시작 시점인지 확인 (처음 접속 시)
	if (hoursDiff >= estimatedHours * 0.9) {
		return "start";
	}

	// 예상 소요시간별 분기 처리
	if (estimatedHours <= 1) {
		// 1시간 이하 작업
		if (hoursDiff <= 10 / 60) return "min10Before";
		return "start";
	}

	if (estimatedHours <= 4) {
		// 1~4시간 작업
		if (hoursDiff <= 1) return "hour1Before";
		return "start";
	}

	if (estimatedHours <= 24) {
		// 4~24시간 작업
		if (hoursDiff <= 1) return "hour1Before";
		if (hoursDiff <= estimatedHours / 2) return "midPoint";
		return "start";
	}

	// 1일 이상 작업
	if (hoursDiff <= 1) return "hour1Before";
	if (hoursDiff <= 24) return "day1Before";

	// 매일 오전 9시 확인
	const isNineAM = now.getHours() === 9 && now.getMinutes() < 30;
	if (isNineAM) return "dailyMorning";

	return "start";
}

// 페르소나 ID와 메시지 타입에 따라 메시지를 반환하는 함수
export function getPersonaMessage(
	personaId: string,
	messageType: TimeMessageType,
): string {
	// 페르소나가 없을 경우 기본 메시지 반환
	if (!personaMessages[personaId]) {
		const defaultMessages = {
			start: "시작 준비 끝! 가볍게 들어가볼까요?",
			dailyMorning: "좋은 아침이에요! 오늘도 화이팅!",
			midPoint: "절반을 완료했어요! 잘 하고 있어요.",
			day1Before: "마감 하루 전이에요! 마무리를 준비해봐요.",
			hour1Before: "마지막 한 시간! 스퍼트 올릴 타이밍이에요!",
			min10Before: "10분 남았어요! 마지막 점검해보세요!",
		};
		return defaultMessages[messageType];
	}

	return personaMessages[personaId][messageType];
}
