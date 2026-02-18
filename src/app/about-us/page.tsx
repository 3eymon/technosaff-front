import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeAboutUsList } from "@/services/homeActions";
import parse, { DOMNode, Element } from "html-react-parser";
import { Metadata } from "next";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

interface AboutT {
  description: string;
  id: number;
  image: string | null;
  order: number;
  title: string;
  video: string | null;
}

export const metadata: Metadata = {
  title: "درباره ما | تکنو صاف",
  description:
    "با تکنو صاف آشنا شوید؛ داستان ما، اهداف، و خدماتی که به شما ارائه می‌دهیم. فروشگاهی مطمئن با محصولات باکیفیت و پشتیبانی حرفه‌ای.",
  keywords: [
    "درباره ما",
    "تکنو صاف",
    "فروشگاه تکنو صاف",
    "داستان تکنو صاف",
    "خدمات تکنو صاف",
  ],
  openGraph: {
    title: "درباره ما | تکنو صاف",
    description:
      "با تکنو صاف آشنا شوید؛ داستان ما، اهداف، و خدماتی که به شما ارائه می‌دهیم. فروشگاهی مطمئن با محصولات باکیفیت و پشتیبانی حرفه‌ای.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
    siteName: "تکنو صاف",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "درباره ما | تکنو صاف",
    description:
      "با تکنو صاف آشنا شوید؛ داستان ما، اهداف و خدمات فروشگاه تکنو صاف.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const transform = (node: DOMNode) => {
  if (node.type === "tag" && node.name === "img") {
    const { src, alt, width, height } = (node as Element).attribs;

    if (!src) return null;

    const fullSrc = src.startsWith("http")
      ? src
      : `${process.env.NEXT_PUBLIC_BACK_END}{src}`;

    const widthNum = width ? parseInt(width) : 600;
    const heightNum = height ? parseInt(height) : 400;

    return (
      <Image
        src={fullSrc}
        alt={alt || ""}
        width={widthNum}
        height={heightNum}
        className="max-w-[500px] max-h-80 object-contain mx-auto"
      />
    );
  }
};

async function AboutUsPage() {
  const result = await homeAboutUsList();
  const aboutUs: AboutT[] = result?.data || [];

  const sortedAboutUs = aboutUs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-10">
      <BreadcrumbsBox
        title="درباره ما"
        items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
      />
      <div className="flex flex-col gap-5 bg-white p-5 shadow rounded container customSm:max-w-[566px]">
        <h1 className="pr-2 -mb-2 font-semibold text-lg 2xl:text-xl">
          درباره ما
        </h1>
        <div className="w-full gap-3 flex">
          <div className="bg-primary w-[7%] h-px" />
          <div className="h-px bg-zinc-400 w-full" />
        </div>

        {sortedAboutUs.length === 0 ? (
          <NoAboutUsContent />
        ) : (
          <div className="space-y-8">
            {sortedAboutUs.map((about) => (
              <AboutUsItem key={about.id} about={about} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AboutUsItem({ about }: { about: AboutT }) {
  const sanitizedHtml = sanitizeHtml(about.description, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "class", "style"],
      a: ["href", "name", "target", "class"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            class:
              (attribs.class || "") +
              " text-cyan-400 spoiler-link relative no-underline",
          },
        };
      },
    },
  });

  return (
    <div key={about.id} className="flex flex-col gap-3">
      {about.title && (
        <h2 className="text-3xl font-semibold text-zinc-800">{about.title}</h2>
      )}

      {about.image && (
        <Image
          width={1080}
          height={1920}
          src={about.image}
          alt={about.title || "تصویر درباره ما"}
          className="rounded-lg w-full aspect-auto max-h-full mx-auto"
          loading="lazy"
        />
      )}

      {about.video && (
        <video
          className="w-full aspect-video rounded-xl shadow-lg object-cover"
          controls
          preload="metadata"
          aria-label={about.title || "ویدیوی درباره ما"}
        >
          <source src={about.video} type="video/mp4" />
          <p>مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.</p>
        </video>
      )}

      {about.description && (
        <div className="prose [&_a]:spoiler-link max-w-full text-zinc-700">
          {parse(sanitizedHtml, { replace: transform })}
        </div>
      )}
    </div>
  );
}

function NoAboutUsContent() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-zinc-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-700 mb-3">
            محتوایی یافت نشد
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-md mx-auto">
            در حال حاضر اطلاعاتی درباره ما در دسترس نمی‌باشد.
            <br />
            تیم ما در حال آماده‌سازی محتوای کامل درباره کسب‌وکار ما است.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
