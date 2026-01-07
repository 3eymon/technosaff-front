import Image from "next/image";
import Link from "next/link";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { FiExternalLink } from "react-icons/fi";
import { FaNewspaper } from "react-icons/fa";
import moment from "moment-jalaali";
import Article from "@/types/blog";

interface LatestPostsSidebarProps {
  latestPostsData: Article[];
}

export default function LatestPostsSidebar({
  latestPostsData,
}: LatestPostsSidebarProps) {
  const formatPersianDate = (jalaliDate: string) => {
    try {
      moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
      return jalaliDate
        ? moment(jalaliDate, "jYYYY-jMM-jDD").format("jDD jMMMM jYYYY")
        : "تاریخ نامشخص";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "تاریخ نامشخص";
    }
  };

  if (!Array.isArray(latestPostsData) || latestPostsData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
        <div className="p-6 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaNewspaper className="text-primary" />
              <h2 className="text-xl font-bold text-zinc-900">
                جدیدترین مقالات
              </h2>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center size-16 bg-zinc-100 rounded-full mb-4">
            <FaNewspaper className="size-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-700 mb-2">
            مقاله‌ای یافت نشد
          </h3>
          <p className="text-zinc-500 text-sm mb-4">
            در حال حاضر هیچ مقاله‌ای برای نمایش وجود ندارد
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            مشاهده همه مقالات
            <FiExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    );
  }

  const validPosts = latestPostsData
    .filter((post) => post && post.id && post.title)
    .slice(0, 5);

  if (validPosts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
        <div className="p-6 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaNewspaper className="text-primary" />
              <h2 className="text-xl font-bold text-zinc-900">
                جدیدترین مقالات
              </h2>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center size-16 bg-zinc-100 rounded-full mb-4">
            <FaNewspaper className="size-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-700 mb-2">
            مقاله‌ای یافت نشد
          </h3>
          <p className="text-zinc-500 text-sm mb-4">
            در حال حاضر هیچ مقاله‌ای برای نمایش وجود ندارد
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            مشاهده همه مقالات
            <FiExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiMiniCalendarDateRange className="text-primary" />
            <h2 className="text-xl font-bold text-zinc-900">جدیدترین مقالات</h2>
          </div>
          <Link
            href="/articles"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            مشاهده همه
            <FiExternalLink className="size-3" />
          </Link>
        </div>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {validPosts.map((post: Article) => (
            <li key={post.id}>
              <Link
                href={`/article/${post.slug}`}
                className="flex gap-4 group p-3 rounded-xl hover:bg-zinc-50 transition-all"
              >
                <div className="relative flex-shrink-0">
                  <div className="relative size-16 rounded-lg overflow-hidden bg-zinc-100">
                    {post.thumbnail ? (
                      <Image
                        src={
                          post.thumbnail.startsWith("http")
                            ? post.thumbnail
                            : `https://mpttools.co${post.thumbnail}`
                        }
                        alt={post.title}
                        width={64}
                        height={64}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <FaNewspaper className="size-6 text-primary/50" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <HiMiniCalendarDateRange className="size-3 text-zinc-400" />
                    <time className="text-xs text-zinc-500">
                      {formatPersianDate(post.jalali_created)}
                    </time>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500">
                      {Math.ceil((post.content?.length || 0) / 1500) || 5} دقیقه
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
