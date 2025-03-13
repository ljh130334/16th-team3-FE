import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['k.kakaocdn.net'], // 카카오 CDN 도메인 추가
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
    ],
  },
  // 기존 설정이 있다면 유지
};

module.exports = nextConfig;