import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['k.kakaocdn.net'], // 카카오 CDN 도메인 추가
  },
};

export default nextConfig;