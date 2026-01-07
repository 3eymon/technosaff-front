import {
  GetBlogBySlug,
  GetBlogCategoriesMenuStructure,
  GetLatestBlogPosts,
} from "@/services/blogActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaFolderOpen,
  FaUserEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { MdCategory, MdErrorOutline } from "react-icons/md";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import moment from "moment-jalaali";
import { Metadata } from "next";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import {
  articleSchema,
  BreadcrumbItem,
  breadcrumbSchema,
} from "@/components/Schema";
import { imageSchema } from "@/components/Schema/imageSchema";
import Script from "next/script";
import { Suspense } from "react";
import ShareSection from "@/components/blog/ShareSection";
import ArticleImage from "@/components/blog/ArticleImage";
import LatestPostsSidebar from "@/components/blog/LatestPostsSidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const data = await GetBlogBySlug((await params).slug);
    if (!data) {
      return {
        title: "مقاله یافت نشد | تکنو صاف",
        description: "مقاله مورد نظر یافت نشد.",
      };
    }
    return {
      title: `${data.title} | تکنو صاف`,
      description: data.introduction || data.title,
      keywords: [
        data.title,
        "مقاله تکنو صاف",
        `مقاله ${data.title}`,
        data.category?.title || "",
      ],
      openGraph: {
        title: data.title,
        description: data.introduction || data.title,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${data.slug}`,
        siteName: "تکنو صاف",
        locale: "fa_IR",
        type: "article",
        publishedTime: data.published_at || data.created_at,
        modifiedTime: data.updated_at,
        authors: data.author_name ? [data.author_name] : undefined,
        tags: data.category?.title ? [data.category.title] : undefined,
        images: data.thumbnail
          ? [
              {
                url: data.thumbnail,
                alt: data.title,
                width: 1200,
                height: 630,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.introduction || data.title,
        images: data.thumbnail ? [data.thumbnail] : [],
        creator: data.author_name
          ? `@${data.author_name.replace(/\s/g, "")}`
          : undefined,
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "مقاله | تکنو صاف",
      description: "مقاله تخصصی در زمینه تکنو صاف",
    };
  }
}

function EmptyCategories() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
      <div className="p-6 border-b border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <MdCategory className="text-primary" />
          دسته‌بندی‌ها
        </h2>
      </div>
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center size-16 bg-zinc-100 rounded-full mb-4">
          <FaExclamationTriangle className="size-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-700 mb-2">
          دسته‌بندی‌ای یافت نشد
        </h3>
        <p className="text-zinc-500 text-sm">
          در حال حاضر هیچ دسته‌بندی‌ای موجود نیست
        </p>
      </div>
    </div>
  );
}

function CategoriesSidebar({ categoriesData }: { categoriesData: any[] }) {
  if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
    return <EmptyCategories />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
      <div className="p-6 border-b border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <FaFolderOpen className="text-primary" />
          دسته‌بندی‌ها
        </h2>
        <p className="text-zinc-600 text-sm mt-2">
          مقالات بر اساس موضوع دسته‌بندی شده‌اند
        </p>
      </div>
      <div className="p-6">
        <ul className="space-y-2">
          {categoriesData.map((cat) => {
            if (!cat) return null;

            return (
              <li key={cat.id || cat.slug || Math.random()}>
                <Link
                  href={`/articles?category=${cat.slug || cat.id}`}
                  className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    <span className="text-zinc-700 group-hover:text-primary font-medium transition-colors line-clamp-1">
                      {cat.title || "بدون عنوان"}
                    </span>
                  </div>
                  {cat.count && (
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full min-w-8 text-center group-hover:bg-primary group-hover:text-white transition-colors">
                      {cat.count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let data;
  let categoriesData: any[] = [];
  let latestPostsData = [];
  let hasError = false;

  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    data = await GetBlogBySlug(decodedSlug);

    if (!data) {
      return notFound();
    }

    try {
      const [categories, latestPosts] = await Promise.allSettled([
        GetBlogCategoriesMenuStructure(),
        GetLatestBlogPosts(),
      ]);

      categoriesData =
        categories.status === "fulfilled" && Array.isArray(categories.value)
          ? categories.value
          : [];

      latestPostsData =
        latestPosts.status === "fulfilled" && Array.isArray(latestPosts.value)
          ? latestPosts.value
          : [];
    } catch (apiError) {
      console.error("Error fetching sidebar data:", apiError);
      hasError = true;
    }
  } catch (error) {
    console.error("Error in BlogArticlePage:", error);
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <MdErrorOutline className="size-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            خطا در بارگذاری مقاله
          </h1>
          <p className="text-red-600 mb-6">
            متأسفانه در بارگذاری مقاله مشکلی پیش آمده است.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              تلاش مجدد
            </button>
            <Link
              href="/articles"
              className="px-6 py-3 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors font-medium"
            >
              بازگشت به مقالات
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
  const latestPostsDataWithFormattedDate = latestPostsData.map((post) => ({
    ...post,
    formattedDate: formatPersianDate(post.jalali_created),
  }));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mpttools.co";
  const currentUrl = `${siteUrl}/article/${data.slug}`;

  const breadcrumbs = [
    { name: "خانه", url: `${siteUrl}/` },
    { name: "مقالات", url: `${siteUrl}/articles` },
    data.category
      ? {
          name: data.category.title,
          url: `${siteUrl}/articles?category_id=${data.category.id}`,
        }
      : null,
    { name: data.title, url: `${siteUrl}/article/${data.slug}` },
  ].flatMap((item) => (item ? [item] : [])) as BreadcrumbItem[];

  const schema = [
    articleSchema(data),
    breadcrumbSchema(breadcrumbs),
    imageSchema(data.thumbnail, data.title),
  ];

  const readTime = Math.ceil((data.content?.length || 0) / 1500) || 5;
  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <ReadingProgressBar />

      <div
        id="article-content"
        className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 lg:p-6 container mx-auto"
      >
        <article className="w-full lg:w-3/4 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-zinc-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Link
                  href="/articles"
                  className="hover:text-primary transition-colors"
                >
                  مقالات
                </Link>
                <span className="text-zinc-300">/</span>
                {data.category && (
                  <>
                    <Link
                      href={`/articles?category_id=${data.category.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {data.category.title}
                    </Link>
                    <span className="text-zinc-300">/</span>
                  </>
                )}
                <span className="text-zinc-700 font-medium truncate">
                  {data.title}
                </span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-zinc-900 leading-tight">
                {data.title}
              </h1>

              {data.introduction && (
                <p className="text-lg lg:text-xl text-zinc-600 leading-relaxed">
                  {data.introduction}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-600">
                  <HiMiniCalendarDateRange className="size-5 text-primary" />
                  <time
                    dateTime={data.created_at}
                    className="text-sm lg:text-base"
                  >
                    {formatPersianDate(data.jalali_created)}
                  </time>
                </div>

                {data.category && (
                  <Link
                    href={`/articles?category_id=${data.category.id}`}
                    className="flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors group"
                  >
                    <FaFolderOpen className="size-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm lg:text-base">
                      {data.category.title}
                    </span>
                  </Link>
                )}

                {data.author_name && (
                  <div className="flex items-center gap-2 text-zinc-600">
                    <FaUserEdit className="size-5 text-primary" />
                    <span className="text-sm lg:text-base">
                      {data.author_name}
                    </span>
                  </div>
                )}

                <div className="ml-auto">
                  <span className="px-3 py-1 bg-primary-400/10 text-primary-700 rounded-full text-sm font-medium">
                    خواندن {readTime} دقیقه
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {data.thumbnail && (
              <div className="mb-8 lg:mb-12 rounded-xl overflow-hidden shadow-lg">
                <ArticleImage
                  src={data.thumbnail}
                  alt={data.title}
                  width={1200}
                  height={630}
                  priority={true}
                  className="w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div className="text-zinc-700 leading-relaxed text-justify">
                {data.content ? (
                  parse(
                    sanitizeHtml(data.content, {
                      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                        "img",
                        "iframe",
                      ]),
                      allowedAttributes: {
                        ...sanitizeHtml.defaults.allowedAttributes,
                        img: [
                          "src",
                          "alt",
                          "width",
                          "height",
                          "class",
                          "style",
                        ],
                        iframe: [
                          "src",
                          "width",
                          "height",
                          "frameborder",
                          "allowfullscreen",
                          "class",
                        ],
                      },
                      transformTags: {
                        a: (tagName, attribs) => ({
                          tagName,
                          attribs: {
                            ...attribs,
                            class:
                              "text-primary hover:text-primary/80 underline underline-offset-2",
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                        }),
                      },
                    })
                  )
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <FaExclamationTriangle className="size-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">متنی برای نمایش وجود ندارد.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        <aside className="w-full lg:w-1/4 flex flex-col gap-6">
          {hasError ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-zinc-100">
              <div className="text-center">
                <MdErrorOutline className="size-8 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-zinc-600">
                  اطلاعات جانبی بارگذاری نشدند
                </p>
              </div>
            </div>
          ) : (
            <>
              <CategoriesSidebar categoriesData={categoriesData} />

              <Suspense fallback={<LatestPostsSkeleton />}>
                <LatestPostsSidebar
                  latestPostsData={latestPostsDataWithFormattedDate}
                />
              </Suspense>

              <Suspense fallback={<ShareSectionSkeleton />}>
                <ShareSection
                  articleTitle={data.title}
                  articleUrl={currentUrl}
                />
              </Suspense>
            </>
          )}
        </aside>
      </div>
    </>
  );
}

function LatestPostsSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
      <div className="p-6 border-b border-zinc-100">
        <div className="h-6 bg-zinc-200 rounded w-1/2 mb-4 animate-pulse" />
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 p-3">
              <div className="size-16 bg-zinc-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-zinc-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareSectionSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
      <div className="p-6 border-b border-zinc-100">
        <div className="h-6 bg-zinc-200 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-4 bg-zinc-200 rounded w-2/3 animate-pulse" />
      </div>
      <div className="p-6">
        <div className="h-4 bg-zinc-200 rounded w-1/4 mb-2 animate-pulse" />
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-12 bg-zinc-200 rounded-lg animate-pulse" />
          <div className="w-20 h-12 bg-zinc-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-3 animate-pulse" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-zinc-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogArticlePage;
