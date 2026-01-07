"use client";

import { useState } from "react";
import {
  FaCopy,
  FaCheck,
  FaTelegram,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
  FaShareAlt,
} from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

interface ShareSectionProps {
  articleTitle: string;
  articleUrl: string;
}

export default function ShareSection({
  articleTitle,
  articleUrl,
}: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const shareLinks = [
    {
      name: "تلگرام",
      icon: <FaTelegram className="size-5" />,
      color: "hover:bg-[#0088cc] hover:text-white",
      url: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
    },
    {
      name: "واتساپ",
      icon: <FaWhatsapp className="size-5" />,
      color: "hover:bg-[#25D366] hover:text-white",
      url: `https://wa.me/?text=${encodeURIComponent(`${articleTitle} - ${articleUrl}`)}`,
    },
    {
      name: "لینکدین",
      icon: <FaLinkedin className="size-5" />,
      color: "hover:bg-[#0077b5] hover:text-white",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    },
    {
      name: "توییتر",
      icon: <FaTwitter className="size-5" />,
      color: "hover:bg-[#1DA1F2] hover:text-white",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleSocialShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100">
      <div className="p-6 border-b border-zinc-100">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <FaShareAlt className="text-primary" />
          اشتراک‌گذاری
        </h2>
        <p className="text-zinc-600 text-sm mt-2">
          این مقاله را با دوستان خود به اشتراک بگذارید
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            لینک مقاله
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-600 truncate">
              {articleUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                copied
                  ? "bg-emerald-100 text-emerald-700"
                  : copyError
                    ? "bg-red-100 text-red-700"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {copyError ? (
                <>
                  <MdErrorOutline className="size-4" />
                  <span className="text-sm font-medium">خطا!</span>
                </>
              ) : copied ? (
                <>
                  <FaCheck className="size-4" />
                  <span className="text-sm font-medium">کپی شد!</span>
                </>
              ) : (
                <>
                  <FaCopy className="size-4" />
                  <span className="text-sm font-medium">کپی</span>
                </>
              )}
            </button>
          </div>
          {copyError && (
            <p className="text-red-500 text-xs mt-2">
              خطا در کپی لینک. لطفاً دوباره تلاش کنید.
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-700 mb-3">
            اشتراک در شبکه‌های اجتماعی
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {shareLinks.map((social) => (
              <button
                key={social.name}
                onClick={() => handleSocialShare(social.url)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 ${social.color} transition-all hover:scale-105 active:scale-95 group`}
                aria-label={`اشتراک در ${social.name}`}
                title={`اشتراک در ${social.name}`}
              >
                <div className="text-zinc-600 group-hover:text-white transition-colors">
                  {social.icon}
                </div>
                <span className="text-xs mt-1.5 text-zinc-600 group-hover:text-white transition-colors">
                  {social.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
