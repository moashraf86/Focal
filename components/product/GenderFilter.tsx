import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GenderFilter({
  gender,
  setGender,
}: {
  gender: string;
  setGender: (gender: string) => void;
}) {
  return (
    <div className="relative flex justify-center items-center mx-auto max-w-fit gap-6 after:content-[''] after:absolute after:w-full after:h-px after:bg-gray-200 after:-bottom-2">
      <Button
        className="px-0 hover:bg-transparent"
        variant="ghost"
        onClick={() => setGender("men")}
      >
        Men
      </Button>
      <Button
        className="px-0 hover:bg-transparent"
        variant="ghost"
        onClick={() => setGender("women")}
      >
        Women
      </Button>
      <span
        className={cn(
          "h-[2px] bg-gray-900 absolute content-[''] left-0 w-full mx-auto -bottom-2 z-10 origin-left transition-transform duration-300",
          gender === "men" ? "scale-[.286]" : "scale-[.495] translate-x-1/2"
        )}
      />
    </div>
  );
}
