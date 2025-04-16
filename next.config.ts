const nextConfig = {
	images: {
		domains: ["k.kakaocdn.net"], // 카카오 CDN 도메인 추가
		remotePatterns: [
			{
				protocol: "http",
				hostname: "k.kakaocdn.net",
				pathname: "/**",
			},
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https:;",
		minimumCacheTTL: 60 * 60 * 24 * 365,
	},
	env: {
		NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
	},
};

module.exports = nextConfig;
