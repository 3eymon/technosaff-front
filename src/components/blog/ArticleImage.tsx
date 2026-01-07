"use client";

import { useState } from "react";
import Image from "next/image";
import { FaExclamationTriangle } from "react-icons/fa";

interface ArticleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export default function ArticleImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
}: ArticleImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`${className} bg-zinc-100 flex items-center justify-center rounded-xl overflow-hidden`}
      >
        <div className="text-center p-8">
          <FaExclamationTriangle className="size-12 text-zinc-400 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">تصویر بارگذاری نشد</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
