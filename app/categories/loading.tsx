import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-lg text-center text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
