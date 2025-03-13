"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  imageUrl: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  alt = "프로필 이미지",
  width = 72,
  height = 72,
  className = "rounded-full",
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const defaultImage = "/icons/mypage/default-profile.png";

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      setHasError(false);
      setImgSrc(imageUrl);
      
      const img = new (window as any).Image() as HTMLImageElement;
      img.src = imageUrl;
      
      img.onload = () => {
        console.log("이미지 로드 성공:", imageUrl);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        console.error("이미지 로드 실패:", imageUrl);
        setHasError(true);
        setIsLoading(false);
        setImgSrc(defaultImage);
      };
    } else {
      setImgSrc(defaultImage);
      setIsLoading(false);
      setHasError(true);
    }
  }, [imageUrl]);

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <Image
      src={hasError ? defaultImage : (imgSrc || defaultImage)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        console.log("이미지 오류 발생 (Image 컴포넌트)");
        setHasError(true);
        setImgSrc(defaultImage);
      }}
      priority
    />
  );
};

export default ProfileImage;