import { Category, Face } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function NavigationBar({
  title,
  items,
  basePath,
  currentSlug,
  showAll = false,
}: {
  title: string;
  items: Category[] | Face[];
  basePath: string;
  currentSlug: string;
  showAll?: boolean;
}) {
  return (
    <div className="sticky top-20 z-20 bg-[#FFF] border-b border-border">
      <div className="container">
        <div className="flex items-center justify-center gap-10">
          <span className="sticky left-0 text-sm text-gray-500 uppercase font-semibold tracking-[1px]">
            {title}
          </span>
          <nav className="max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-proximity">
            <ul className="grid grid-flow-col gap-10 min-w-max font-barlow pe-10">
              {showAll && (
                <li className="py-5">
                  <Link
                    href={basePath}
                    className={cn(
                      "relative inline-block after:absolute after:w-full after:left-0 after:h-px after:bottom-0 after:content-[''] after:bg-black after:transition-transform after:duration-200 after:ease-in-out after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left",
                      {
                        "after:scale-x-100 after:origin-left":
                          currentSlug === "all",
                      }
                    )}
                  >
                    All
                  </Link>
                </li>
              )}
              {items.map((item) => (
                <li key={item.documentId} className="py-5">
                  <Link
                    prefetch={true}
                    href={`${basePath}/${item.slug}`}
                    className={cn(
                      "relative inline-block after:absolute after:w-full after:left-0 after:h-px after:bottom-0 after:content-[''] after:bg-black after:transition-transform after:duration-200 after:ease-in-out after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left",
                      {
                        "after:scale-x-100 after:origin-left":
                          currentSlug === item.slug,
                      }
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
