"use client";
import ProductType from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";

// Loader سفارشی برای remote images
const remoteLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Card({
  item,
  href,
  className,
}: {
  item: ProductType;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href ? href : `/product/${item.slug}`}
      key={item.id}
      title={item.name}
      className="size-full flex relative group/card h-full"
    >
      <div
        className={`bg-white shadow rounded-2xl p-3.5 sm:p-5 hover:shadow-lg transition-shadow group/card w-full flex flex-col relative h-96 ${className ?? ""}`}
      >
        <div className="relative w-full h-56 bg-zinc-200 rounded-t-lg overflow-hidden flex items-center justify-center">
          {item.cover_image ? (
            <Image
              src={
                item.cover_image.startsWith("/media")
                  ? `${process.env.NEXT_PUBLIC_BACK_END}${item.cover_image}`
                  : item.cover_image
              }
              alt={`${item.name} - مجموعه فروش ابزار و آموزش صافکاری تکنوصاف `}
              className="w-full h-full object-cover rounded-t-lg"
              width={360}
              height={160}
              loading="lazy"
              loader={remoteLoader} // loader سفارشی
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAHUlEQVQYV2NkYGD4z0AEYBxVSFUBYwMjAwMDAwAANzME2Tf9M0AAAAASUVORK5CYII=" // placeholder سبک
            />
          ) : (
            <CiImageOff className="size-15 text-zinc-500" />
          )}
        </div>

        <h3 className="font-semibold text-zinc-700 line-clamp-2 text-lg mt-2">
          {item.name}
        </h3>

        {item.is_available ? (
          <div className="relative mt-auto flex justify-end gap-2">
            {item.isDiscounted && item.final_price !== undefined ? (
              <div>
                <div className="flex items-center">
                  <p className="line-through text-zinc-500 ml-2 text-sm">
                    {item.price?.toLocaleString("fa-IR") ?? "۰"} تومان
                  </p>
                  <span className="px-2 text-white bg-danger rounded-full">
                    {item.discount_percentage?.toLocaleString("fa-IR")}%
                  </span>
                </div>
                <p className="font-medium text-xl">
                  {item.final_price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            ) : (
              <p className="font-bold text-xl ">
                {item.price?.toLocaleString("fa-IR") ?? "۰"} تومان
              </p>
            )}
          </div>
        ) : (
          <div className="w-full pt-[7.5px] pb-[7.5px]">
            <div className="inline-flex items-center justify-center w-full relative text-zinc-500">
              <hr className="w-full h-px my-0 bg-zinc-600 border-0 rounded-sm" />
              <p className="absolute px-2 pb-0.5 -translate-x-1/2 bg-white left-1/2 text-ellipsis text-nowrap whitespace-nowrap font-semibold">
                در حال حاضر موجود نیست
              </p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
