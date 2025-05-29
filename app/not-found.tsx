import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="container text-center h-[calc(100vh-16rem)] flex flex-col justify-center bg-background">
      <div className="flex self-stretch justify-center items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-light border-r border-border pr-4">
          404
        </h1>
        <p className="text-3xl sm:text-4xl font-light leading-tight pl-4 uppercase">
          Page not found.
        </p>
      </div>
      <Button
        asChild
        variant="emphasis"
        size="lg"
        className="inline-flex justify-center items-center mx-auto"
      >
        <Link href="/">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="remixicon mr-2"
          >
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
