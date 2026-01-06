import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeContactInfoList } from "@/services/homeActions";
import { Metadata } from "next";
import { Suspense } from "react";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
interface Contact {
  id: number;
  phone_number: string | null;
  address: string | null;
}
export const metadata: Metadata = {
  title: "ارتباط با ما | تکنو صاف",
  description:
    "راه‌های تماس با فروشگاه تکنو صاف؛ آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.",
  keywords: [
    "ارتباط با ما",
    "تماس با تکنو صاف",
    "فروشگاه تکنو صاف",
    "آدرس تکنو صاف",
    "شماره تلفن تکنو صاف",
  ],
  openGraph: {
    title: "ارتباط با ما | تکنو صاف",
    description:
      "راه‌های تماس با فروشگاه تکنو صاف؛ آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact-info`,
    siteName: "تکنو صاف",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ارتباط با ما | تکنو صاف",
    description:
      "راه‌های تماس با فروشگاه تکنو صاف؛ آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
async function page() {
  const result = await homeContactInfoList();
  const contactInfo: Contact[] = result?.data;
  return (
    <div className="space-y-10">
      <BreadcrumbsBox
        title="ارتباط با ما"
        items={[{ label: "خانه", href: "/" }, { label: "ارتباط با ما" }]}
      />
      <div className="flex flex-col gap-5 bg-white p-5 shadow rounded container customSm:max-w-[566px]">
        <h1 className="pr-2 -mb-2 font-semibold text-lg 2xl:text-xl">ارتباط با ما</h1>
        <div className="w-full gap-3 flex">
          <div className="bg-primary w-[7%] h-px" />
          <div className="h-px bg-zinc-400 w-full" />
        </div>
        <Suspense fallback={null}>
          <div className="space-y-4">
            {contactInfo.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3"
              >
                {c.address && (
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FaMapMarkerAlt className="size-4 text-primary scale-x-[-1]" />
                    </div>
                    <p className="text-sm 2xl:text-lg text-zinc-700 leading-relaxed">
                      {c.address}
                    </p>
                  </div>
                )}

                {c.address && c.phone_number && (
                  <div className="h-px bg-zinc-100" />
                )}

                {c.phone_number && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <BsFillTelephonePlusFill className="size-4 text-primary scale-x-[-1]" />
                    </div>
                    <a
                      href={`tel:${c.phone_number}`}
                      className="text-sm 2xl:text-lg font-medium text-zinc-800 hover:text-primary transition font-dana"
                    >
                      {c.phone_number}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default page;
