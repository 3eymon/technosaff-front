"use client";

import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  item: {
    link: string;
    name: string;
    image: string;
  };
};

export default function Brand({ item }: BrandProps) {
  return (
    <Link
      href={item.link}
      title={item.name}
      className="flex items-center justify-center py-3 rounded-xl bg-white border border-gray-100 transition hover:shadow-sm cursor-default"
    >
      <Image
        src={item.image}
        alt={item.name}
        width={120}
        height={120}
        className="object-contain max-h-32 max-w-32 rounded-xl "
      />
    </Link>
  );
}
