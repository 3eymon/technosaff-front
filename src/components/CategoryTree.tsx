"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  FolderClosed,
  X,
  Menu,
  Hash,
} from "lucide-react";
import { BlogCategoryNode } from "@/types/categories";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface CategoryTreeProps {
  categories: BlogCategoryNode[];
  isMobile?: boolean;
}
export default function CategoryTree({
  categories,
  isMobile = false,
}: CategoryTreeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const activeCategory = searchParams.get("category");

  const filteredCategories = searchQuery
    ? categories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.children.some((child) =>
            child.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : categories;
  const handleCategoryClick = (category: BlogCategoryNode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.slug);

    router.push(`/articles?${params.toString()}`);

    if (isMobile) {
      setShowModal(false);
    }
  };
  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/articles?${params.toString()}`);
    if (isMobile) {
      setShowModal(false);
    }
  };
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-gray-200 rounded-2xl active:scale-[0.98] transition-transform duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Menu className="h-5 w-5 text-primary" />
            </div>

            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-gray-800">
                دسته‌بندی مقالات
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {categories.length} دسته‌بندی
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-primary/10 text-primary-700 rounded-full text-sm font-medium">
              {categories.length}
            </div>

            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </div>
        </button>

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />

              <motion.div
                className="fixed inset-0 md:inset-auto md:bottom-0 md:left-0 md:right-0 bg-gradient-to-b from-white to-gray-50 md:rounded-t-3xl p-6 z-[101] md:max-h-[85vh] overflow-hidden shadow-2xl"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                }}
              >
                <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          دسته‌بندی‌ها
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          مقالات براساس موضوع دسته‌بندی شده‌اند
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Hash className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجو در دسته‌بندی‌ها..."
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                {activeCategory && (
                  <div className="p-4 border-b border-gray-100 bg-amber-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-700">
                          فیلتر شده:
                        </span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          {
                            categories.find(
                              (cat) => cat.slug === activeCategory
                            )?.title
                          }
                        </span>
                      </div>
                      <button
                        onClick={handleClearFilter}
                        className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        حذف فیلتر
                      </button>
                    </div>
                  </div>
                )}
                <div className="mt-6 overflow-y-auto max-h-[60vh] pr-2">
                  {filteredCategories.length > 0 ? (
                    <div className="space-y-3">
                      {filteredCategories.map((category) => (
                        <MobileCategoryItem
                          key={category.id}
                          category={category}
                          depth={0}
                          onSelect={handleCategoryClick}
                          activeCategory={activeCategory}
                          searchQuery={searchQuery}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FolderClosed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        دسته‌بندی‌ای یافت نشد
                      </h3>
                      <p className="text-gray-500 text-sm">
                        "{searchQuery}" در دسته‌بندی‌ها وجود ندارد
                      </p>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
                  >
                    بستن
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200 overflow-hidden ">
      <div className="p-7 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FolderOpen className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              دسته‌بندی مقالات
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              مقالات بر اساس موضوع دسته‌بندی شده‌اند
            </p>
          </div>
        </div>
      </div>
      {activeCategory && (
        <div className="p-4 border-b border-gray-100 bg-amber-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-700">فیلتر شده:</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {categories.find((cat) => cat.slug === activeCategory)?.title}
              </span>
            </div>
            <button
              onClick={handleClearFilter}
              className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              حذف فیلتر
            </button>
          </div>
        </div>
      )}
      <div className="p-5 max-h-[500px] overflow-y-auto">
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <DesktopCategoryItem
              key={category.id}
              category={category}
              depth={0}
              onSelect={handleCategoryClick}
              activeCategory={activeCategory}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">تعداد دسته‌بندی‌ها:</span>
          <span className="font-medium ring-2 ring-primary-200 border border-primary-300 bg-primary-100  py-1 px-4 rounded-full">
            {categories.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileCategoryItem({
  category,
  depth,
  onSelect,
  activeCategory,
  searchQuery,
}: {
  category: BlogCategoryNode;
  depth: number;
  onSelect: (category: BlogCategoryNode) => void;
  activeCategory?: string | null;
  searchQuery: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children.length > 0;
  const isActive = activeCategory === category.slug;
  const isHighlighted =
    searchQuery &&
    category.title.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 cursor-pointer",
          isActive
            ? "bg-primary/10 border border-primary/20 shadow-sm"
            : "bg-white border border-gray-100 hover:border-primary/30 hover:shadow-md hover:bg-primary/5",
          isHighlighted && "ring-2 ring-primary/20"
        )}
        onClick={() => (hasChildren ? setIsOpen(!isOpen) : onSelect(category))}
      >
        <div
          className="flex-shrink-0 transition-all duration-300"
          style={{ marginRight: depth * 16 }}
        >
          {hasChildren ? (
            <ChevronLeft
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                isOpen ? "-rotate-90" : "rotate-0"
              )}
            />
          ) : (
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            )}
          >
            {hasChildren ? (
              isOpen ? (
                <FolderOpen className="h-4 w-4" />
              ) : (
                <FolderClosed className="h-4 w-4" />
              )
            ) : (
              <Hash className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              "font-medium text-sm truncate transition-colors",
              isActive ? "text-zinc-800 font-bold" : "text-gray-700"
            )}
          >
            {category.title}
          </span>
        </div>

        {hasChildren && (
          <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {category.children.length}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-2 space-y-2 border-r-2 border-gray-100 pr-2">
              {category.children.map((child) => (
                <MobileCategoryItem
                  key={child.id}
                  category={child}
                  depth={depth + 1}
                  onSelect={onSelect}
                  activeCategory={activeCategory}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopCategoryItem({
  category,
  depth,
  onSelect,
  activeCategory,
}: {
  category: BlogCategoryNode;
  depth: number;
  onSelect: (category: BlogCategoryNode) => void;
  activeCategory?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children.length > 0;
  const isActive = activeCategory === category.slug;

  return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer border border-transparent",
          isActive
            ? "bg-primary/10 border border-primary transform -translate-x-1"
            : "hover:bg-primary/5 hover:border hover:border-primary hover:translate-x-1"
        )}
        onClick={() => (hasChildren ? setIsOpen(!isOpen) : onSelect(category))}
      >
        <motion.div
          className="flex-shrink-0"
          style={{ marginRight: depth * 20 }}
          animate={{ rotate: isOpen ? -90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {hasChildren ? (
            <ChevronLeft className="h-3.5 w-3.5 text-gray-400" />
          ) : (
            <div className="h-3.5 w-3.5 flex items-center justify-center">
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-primary/40"
                animate={{ scale: isActive ? 1.5 : 1 }}
              />
            </div>
          )}
        </motion.div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "p-1.5 rounded-md transition-colors",
              isActive
                ? "bg-white/20"
                : "bg-gray-100 text-gray-600 group-hover:bg-primary/10"
            )}
          >
            {hasChildren ? (
              isOpen ? (
                <FolderOpen className="h-3.5 w-3.5" />
              ) : (
                <FolderClosed className="h-3.5 w-3.5" />
              )
            ) : (
              <Hash className="h-3.5 w-3.5" />
            )}
          </div>

          <span
            className={cn(
              "font-medium text-sm truncate transition-colors",
              isActive ? "" : "text-gray-700"
            )}
          >
            {category.title}
          </span>
        </div>

        {hasChildren && (
          <motion.div
            className={cn(
              "px-2 py-0.5 text-xs rounded-full transition-colors",
              isActive ? "bg-white/30 text-white" : "bg-gray-100 text-gray-600"
            )}
            animate={{ scale: isActive ? 1.1 : 1 }}
          >
            {category.children.length}
          </motion.div>
        )}
      </div>

      {hasChildren && (
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0.5,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="ml-10 mt-2 pl-3 border-l-2 border-dashed border-gray-200 space-y-2">
            {category.children.map((child) => (
              <DesktopCategoryItem
                key={child.id}
                category={child}
                depth={depth + 1}
                onSelect={onSelect}
                activeCategory={activeCategory}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
