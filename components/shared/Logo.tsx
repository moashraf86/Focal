import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link className="block" href="/">
      <span className="sr-only">Home</span>
      <Image
        alt="Logo"
        src="/logo.avif"
        width={96}
        height={20}
        quality={100}
        className={cn(
          "object-scale-down object-center transition-all duration-300",
          className
        )}
      />
    </Link>
  );
}
