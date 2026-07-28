import React, { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  objectFit?: 'cover' | 'contain';
}

export function Image({
  src,
  alt,
  aspectRatio = 'square',
  objectFit = 'contain',
  className = '',
  ...props
}: ImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto',
  };

  const fitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-50 flex items-center justify-center p-2 border border-slate-100 ${aspectClasses[aspectRatio]} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full ${fitClasses[objectFit]} transition-transform duration-200 hover:scale-105`}
        {...props}
      />
    </div>
  );
}