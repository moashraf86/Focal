"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();

  return (
    <Image
      alt="Logo"
      width={100}
      height={20}
      src="/logo.avif"
      className={cn(
        "group-hover:invert transition-all duration-300",
        pathname !== "/" && "invert"
      )}
    />
  );
}
