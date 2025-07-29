import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Leaf, LucideProps, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "../ui/button";

type FeatureType = "warranty" | "payment" | "co2";

interface FeatureContent {
  id: FeatureType;
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  ariaLabel: string;
}
// Feature content configuration
const features: FeatureContent[] = [
  {
    id: "warranty",
    title: "Warranty",
    description:
      "All our watches are guaranteed against any defects in materials or manufacturing during 2 years from the date of purchase <br/> <br/> This warranty covers manufacturing defects on the watch itself (movement, case, crystal). Other parts are not covered by this warranty. To have replacement covered under this warranty performed, please reach out to us.",
    icon: ShieldCheck,
    ariaLabel: "Open Warranty Info",
  },
  {
    id: "payment",
    title: "Payment",
    description:
      "We accept the following credit cards: Visa, MasterCard, Visa Electron, Paypal, Apple Pay. <br/> <br/> The amount will be deducted from your account when the purchased item(s) leaves our stock. Prices are included Danish VAT. Unless you are from countries where you do not have to pay Danish VAT such as NO, US or AE, then the prices will be shown excluding VAT.",
    icon: CreditCard,
    ariaLabel: "Open Payment Info",
  },
  {
    id: "co2",
    title: "CO2 Neutral",
    description:
      "We have been calculating how much CO2 is being emitted by our employees, manufacturing, shipping and stores. And then we've rounded up those numbers. That's why we, for every time you buy a watch, offset the order with a 125 kilo CO2 reduction by funding environmental friendly projects carefully selected by CHOOOSE. <br/> <br/> The programme includes funding wind power projects in Costa Rica and Vietnam and a hydropower project in Laos. These initiatives create the most effective and fastest combat to climate change.",
    icon: Leaf,
    ariaLabel: "Open CO2 Neutral Info",
  },
];

export default function FeaturedIcons({ className }: { className?: string }) {
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  const handleOpen = (featureId: FeatureType) => {
    setActiveFeature(featureId);
  };

  const handleClose = () => {
    setActiveFeature(null);
  };

  // Get the currently active feature content
  const activeFeatureContent = features.find(
    (feature) => feature.id === activeFeature
  );

  return (
    <div className={cn("flex items-center gap-8 mt-8", className)}>
      {/* Feature Icons */}
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <Button
            key={feature.id}
            variant="ghost"
            className="flex items-center gap-2 text-sm capitalize underline underline-offset-4 font-normal tracking-normal hover:bg-transparent focus:bg-transparent px-0"
            onClick={() => handleOpen(feature.id)}
          >
            <IconComponent className="w-5 h-5" />
            <span>{feature.title}</span>
          </Button>
        );
      })}

      {/* Single Dynamic Sheet */}
      <Sheet open={activeFeature !== null} onOpenChange={handleClose}>
        <SheetContent side={isMobile ? "bottom" : "right"}>
          {activeFeatureContent && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 tracking-normal">
                  <div className="flex items-center gap-2">
                    <activeFeatureContent.icon className="w-5 h-5" />
                    <span>{activeFeatureContent.title}</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <SheetDescription
                className="py-4 px-8 text-base"
                dangerouslySetInnerHTML={{
                  __html: activeFeatureContent.description,
                }}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
