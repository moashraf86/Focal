// components/shared/Preloader.tsx
import { Loader2 } from "lucide-react";

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p>Loading..</p>
      </div>
    </div>
  );
}
