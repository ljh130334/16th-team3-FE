"use client";
/* eslint-disable @next/next/no-img-element */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { josa } from "es-hangul";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

// ----------------------------------
// 타입 정의
// ----------------------------------
type YoutubeVideoInfosResponse = {
	id: string;
	snippet: {
		title: string;
		thumbnails: {
			high: {
				url: string;
			};
		};
	};
	contentDetails: {
		duration: string;
	};
};

type YoutubeVideoInfo = {
	id: string;
	title: string;
	thumbnail: string;
	remainingTime: string;
};

type YoutubeVideoInfos = YoutubeVideoInfo[];

const mockPlaylist = {
	playlistIds: [
		"HQwLPhE2zys",
		"PLLRRXURicM",
		"H94ntp93SGY",
		"PLLRRXURicM",
		"HQwLPhE2zys",
	],
};

// ----------------------------------
// Playlist 컴포넌트
// ----------------------------------
function getPersonaVideoInfos(personaId: number) {
	return queryOptions({
		queryKey: ["personaPlaylist", personaId],
		queryFn: async () => {
			const res = await fetch(`/api/persona/${personaId}/playlists`);
			if (!res.ok) {
				throw new Error("Failed to fetch playlist");
			}
			const { playlistIds: vids } = (await res.json()) as {
				playlistIds: string[];
			};

			const videoInfos = await getYoutubeVideoInfos(vids);
			if (!videoInfos) {
				throw new Error("Failed to fetch video infos");
			}
			return videoInfos;
		},
		gcTime: 1000 * 60 * 5, // 5분
	});
}

export function Playlist({
	personaTaskMode,
	personaTaskType,
	personaId,
}: {
	personaTaskMode: string;
	personaTaskType: string;
	personaId: number;
}) {
	const query = useSuspenseQuery(getPersonaVideoInfos(personaId));
	const [currentYoutubeInfo, setCurrentYoutubeInfo] =
		useState<YoutubeVideoInfo | null>(query.data?.[0] || null);
	// 선택된 음악이 있는지를 추적하는 상태 추가
	const [isSelected, setIsSelected] = useState<boolean>(false);

	if (!currentYoutubeInfo) {
		return <div className="text-white">Loading...</div>;
	}

	const vInfos = query.data.filter(
		(video) => video.id !== currentYoutubeInfo.id,
	);

	return (
		<div className="flex flex-col w-full">
			{/* 지금 딱 맞는 음악 또는 재생 중 음악 */}
			{currentYoutubeInfo && (
				<section>
					<div className="s2 text-gray-normal my-[18px]">
						{isSelected ? "재생 중 음악" : "지금 딱 맞는 음악"}
					</div>
					<SingleMusicItem videoInfo={currentYoutubeInfo} />
				</section>
			)}

			{/* 긴급한 글쓰기를 돕는 음악 (전체 리스트) */}
			{vInfos && vInfos.length > 1 && (
				<section className="mt-7">
					<h2 className="s2 text-white my-[10px]">
						{personaTaskMode} {josa(personaTaskType, "을/를")} 돕는 음악
					</h2>
					<div className="flex flex-col gap-1">
						{vInfos.map((video, i) => (
							<MultiMusicItem
								key={video.id + String(i)}
								videoInfo={video}
								onClick={(id) => {
									const selectedVideo = vInfos.find((v) => v.id === id);
									if (selectedVideo) {
										setCurrentYoutubeInfo(selectedVideo);
										setIsSelected(true);
									}
								}}
							/>
						))}
					</div>
				</section>
			)}
		</div>
	);
}

// ----------------------------------
// 지금 딱 맞는 음악 (단일)
// ----------------------------------

export default function SingleMusicItem({
	videoInfo,
}: { videoInfo: YoutubeVideoInfo }) {
	/*
    전환 단계를 관리하는 상태:
      - THUMBNAIL           (기본; 썸네일 완전히 보임)
      - THUMBNAIL_FADEOUT   (썸네일을 빠르게 사라지게 함)
      - EXPAND_BOX          (박스 높이 확장 중. 임베드는 숨김)
      - EMBED               (임베드 fully 보임)
      - EMBED_FADEOUT       (임베드 빠르게 사라지게 함)
      - COLLAPSE_BOX        (박스 높이 축소 중. 썸네일은 숨김)
  */
	const [stage, setStage] = useState<
		| "THUMBNAIL"
		| "THUMBNAIL_FADEOUT"
		| "EXPAND_BOX"
		| "EMBED"
		| "EMBED_FADEOUT"
		| "COLLAPSE_BOX"
	>("THUMBNAIL");

	// 유튜브 embed URL
	const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoInfo.id}?playsinline=1&fs=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

	// ↓ [확대 로직] 별도 함수
	const handleExpand = () => {
		// 1) 썸네일 빠르게 fadeout
		setStage("THUMBNAIL_FADEOUT");
		setTimeout(() => {
			// 2) 박스가 커지는 단계
			setStage("EXPAND_BOX");
			setTimeout(() => {
				// 3) 임베드 fadein
				setStage("EMBED");
			}, 300); // 박스 확장 끝난 후 임베드 표시
		}, 200); // 썸네일 fadeout 시간
	};

	// ↓ [축소 로직] 별도 함수
	const handleCollapse = () => {
		// 1) 임베드 빠르게 fadeout
		setStage("EMBED_FADEOUT");
		setTimeout(() => {
			// 2) 박스가 축소
			setStage("COLLAPSE_BOX");
			setTimeout(() => {
				// 3) 썸네일 fadein
				setStage("THUMBNAIL");
			}, 300);
		}, 200);
	};

	return (
		<motion.div
			layout // 레이아웃 애니메이션 (박스 높이 변화 시, 아래가 밀려남)
			transition={{ duration: 0.3 }}
			className="bg-component-gray-primary rounded-[16px] my-[10px]"
		>
			{/* 
        (A) 썸네일 
        - visible only in THUMBNAIL, THUMBNAIL_FADEOUT (단, fadeout 시 opacity=0)
        - 박스가 확장되는동안(EXPAND_BOX)나 EMBED 상태에선 숨김(0height)
      */}
			<motion.div
				layout
				transition={{
					duration: 0.2,
				}}
				animate={{
					height:
						stage === "THUMBNAIL" || stage === "THUMBNAIL_FADEOUT" ? "auto" : 0,
					opacity:
						stage === "THUMBNAIL" ? 1 : stage === "THUMBNAIL_FADEOUT" ? 0 : 0,
					pointerEvents: stage === "THUMBNAIL" ? "auto" : "none",
				}}
				style={{ overflow: "hidden" }}
			>
				<ThumbnailView
					title={videoInfo.title}
					thumbnail={videoInfo.thumbnail}
					remainingTime={videoInfo.remainingTime}
					onExpand={handleExpand}
				/>
			</motion.div>

			{/* 
        (B) 임베드 섹션 
        - 항상 DOM에 존재하므로 iframe 안 끊김
        - 'EXPAND_BOX' 단계에서 높이는 auto(박스가 커짐) but opacity=0
          => 실제로는 자리만 차지, 눈에 안 보임
        - 'EMBED' 단계에서 opacity=1 (fadein)
      */}
			<motion.div
				layout
				transition={{
					duration: 0.2,
				}}
				animate={{
					height:
						stage === "EXPAND_BOX" ||
						stage === "EMBED" ||
						stage === "EMBED_FADEOUT" ||
						stage === "COLLAPSE_BOX"
							? "auto"
							: 0,
					opacity:
						stage === "EXPAND_BOX" || stage === "COLLAPSE_BOX"
							? 0
							: stage === "EMBED"
								? 1
								: stage === "EMBED_FADEOUT"
									? 0
									: 0,
					pointerEvents: stage === "EMBED" ? "auto" : "none",
				}}
				style={{ overflow: "hidden" }}
			>
				<EmbedView
					title={videoInfo.title}
					youtubeEmbedUrl={youtubeEmbedUrl}
					remainingTime={videoInfo.remainingTime}
					onCollapse={handleCollapse}
				/>
			</motion.div>
		</motion.div>
	);
}

/* ----------------------------
   썸네일 섹션
---------------------------- */
function ThumbnailView({
	title,
	thumbnail,
	remainingTime,
	onExpand,
}: {
	title: string;
	thumbnail: string;
	remainingTime: string;
	onExpand: () => void;
}) {
	return (
		<div className="p-3 flex items-start">
			<img
				src={thumbnail}
				alt={title}
				className="w-14 h-14 rounded-[10px] object-cover"
			/>
			<div className="flex flex-col flex-1 ml-4 mr-2">
				<p className="text-sm font-medium text-white line-clamp-2 overflow-hidden text-ellipsis">
					{title}
				</p>
				<p className="text-xs text-gray-400 mt-1">{remainingTime}</p>
			</div>

			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button className="mt-1" onClick={onExpand}>
				<ZoomInSvg />
			</button>
		</div>
	);
}

/* ----------------------------
   임베드 섹션
---------------------------- */
function EmbedView({
	title,
	youtubeEmbedUrl,
	remainingTime,
	onCollapse,
}: {
	title: string;
	youtubeEmbedUrl: string;
	remainingTime: string;
	onCollapse: () => void;
}) {
	return (
		<div>
			{/* 유튜브 iFrame (항상 DOM에 존재) */}
			<div className="w-full aspect-video rounded-t-[17px] overflow-hidden bg-black">
				<iframe
					src={youtubeEmbedUrl}
					className="w-full h-full rounded-t-[16px]"
					allowFullScreen={false}
					allow="autoplay; encrypted-media"
					title="YouTube video"
				/>
			</div>

			{/* 타이틀 / 시간 / 축소 버튼 */}
			<div className="flex items-start gap-4 px-4 pb-4 pt-3">
				<div className="flex justify-between items-center flex-1">
					<div className="flex flex-col leading-tight">
						<p className="b3 text-gray-normal line-clamp-2 overflow-hidden text-ellipsis">
							{title}
						</p>
						<p className="c2 text-gray-alternative mt-1">{remainingTime}</p>
					</div>
				</div>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button onClick={onCollapse} className="w-6 h-6">
					<ZoomOutSvg />
				</button>
			</div>
		</div>
	);
}

/* -----------------------------
   아이콘들 (줌인 / 줌아웃)
----------------------------- */
function ZoomInSvg() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>zoomin</title>
			<path
				d="M12 8L19 1M19 1H13M19 1V7M8 12L1 19M1 19H7M1 19L1 13"
				stroke="#A7B4C7"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
}

function ZoomOutSvg() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>zoomout</title>
			<path
				d="M0.999863 6H1.19986C2.88002 6 3.7201 6 4.36183 5.67302C4.92632 5.3854 5.38526 4.92646 5.67288 4.36197C5.99986 3.72024 5.99986 2.88016 5.99986 1.2V1M0.999863 14H1.19986C2.88002 14 3.7201 14 4.36183 14.327C4.92632 14.6146 5.38526 15.0735 5.67288 15.638C5.99986 16.2798 5.99986 17.1198 5.99986 18.8V19M13.9999 1V1.2C13.9999 2.88016 13.9999 3.72024 14.3268 4.36197C14.6145 4.92646 15.0734 5.3854 15.6379 5.67302C16.2796 6 17.1197 6 18.7999 6H18.9999M13.9999 19V18.8C13.9999 17.1198 13.9999 16.2798 14.3268 15.638C14.6145 15.0735 15.0734 14.6146 15.6379 14.327C16.2796 14 17.1197 14 18.7999 14H18.9999"
				stroke="#A7B4C7"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
}

// ----------------------------------
// 긴급한 글쓰기를 돕는 음악 (리스트용 단일 아이템)
// ----------------------------------
function MultiMusicItem({
	videoInfo,
	onClick,
}: { videoInfo: YoutubeVideoInfo; onClick: (id: string) => void }) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className="flex items-center gap-3 rounded-[16px] py-3"
			onClick={() => onClick(videoInfo.id)}
		>
			{/* 썸네일 */}
			<img
				className="w-14 h-14 rounded-[10px] object-cover shrink-0"
				src={videoInfo.thumbnail}
				alt={videoInfo.title}
			/>

			{/* 텍스트 영역 */}
			<div className="flex flex-col flex-1">
				{/* 제목 - 2줄 말줄임 처리 */}
				<p
					className="
            b3 text-white 
            line-clamp-2 overflow-hidden text-ellipsis
          "
				>
					{videoInfo.title}
				</p>
				<p className="mt-1 text-xs text-gray-400">{videoInfo.remainingTime}</p>
			</div>
		</div>
	);
}

// ----------------------------------
// 유튜브 영상 정보 가져오는 예시 함수
// ----------------------------------
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
async function getYoutubeVideoInfos(vids: string[]) {
	if (!Array.isArray(vids) || vids.length === 0) {
		throw new Error("videoIds 배열이 비어있습니다.");
	}
	if (!API_KEY) {
		throw new Error("NEXT_PUBLIC_YOUTUBE_API_KEY가 필요합니다.");
	}

	const joinedVids = vids.join(",");
	const url = `https://www.googleapis.com/youtube/v3/videos?id=${joinedVids}&part=snippet,contentDetails&key=${API_KEY}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		if (!data.items || data.items.length === 0) {
			return [];
		}

		const result = data.items.map((item: YoutubeVideoInfosResponse) => {
			const videoId = item.id;
			const { title, thumbnails } = item.snippet;
			const { duration } = item.contentDetails;
			return {
				id: videoId,
				title,
				thumbnail: thumbnails.high.url || "",
				remainingTime: parseDurationToHHMM(duration),
			};
		});
		return result as YoutubeVideoInfos;
	} catch (err) {
		console.error("YouTube Data API 요청 중 에러:", err);
		throw err;
	}
}

// ----------------------------------
// ISO 8601 시간 -> HH:MM:SS 변환
// ----------------------------------
function parseDurationToHHMM(isoDuration: string): string {
	const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return "00:00:00";
	const hours = Number.parseInt(match[1] || "0", 10);
	const minutes = Number.parseInt(match[2] || "0", 10);
	const seconds = Number.parseInt(match[3] || "0", 10);
	const hh = String(hours).padStart(2, "0");
	const mm = String(minutes).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");
	return `${hh}:${mm}:${ss}`;
}
