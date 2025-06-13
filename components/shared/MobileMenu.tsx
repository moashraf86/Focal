"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, UserRound, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { categories, faces } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@uidotdev/usehooks";

export default function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const WindowSize = useWindowSize();
  const isMobile = WindowSize.width && WindowSize.width < 1024;

  React.useEffect(() => {
    // Close the menu when the pathname changes
    setOpen(false);
    // If on mobile, close the menu when the pathname changes
    if (!isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-inherit hover:bg-transparent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby="menu">
        <SheetHeader>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center text-inherit hover:bg-transparent p-0 size-5"
            >
              <span className="sr-only">Close menu</span>
              <X />
            </Button>
          </SheetClose>
          <SheetTitle className="text-lg font-semibold sr-only">
            Mobile Menu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Explore our categories and faces, or manage your orders.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto h-full">
          <Accordion type="multiple" className="px-6 md:px-10">
            <AccordionItem value="shop">
              <AccordionTrigger className="sm:text-lg font-jost font-light hover:no-underline tracking-wide uppercase py-5">
                Shop
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ps-2">
                  {categories.map((category) => (
                    <li key={category.id} className="py-2">
                      <Link href={category.href}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faces" className="border-b border-border">
              <AccordionTrigger className="sm:text-lg font-jost font-light hover:no-underline tracking-wide uppercase py-5">
                Faces
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex items-center flex-nowrap overflow-x-auto py-4">
                  {faces.map((face) => (
                    <li key={face.id} className="basis-1/3 shrink-0">
                      <Link
                        href={face.href}
                        className="w-full inline-flex flex-col justify-center items-center gap-2"
                      >
                        <Image
                          src={face.icon}
                          alt={`${face.name} icon`}
                          width={100}
                          height={100}
                          className="inline-block mix-blend-multiply"
                        />
                        {face.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <Link
              href="/orders"
              className="block py-5 text-lg font-jost font-light hover:no-underline tracking-wide uppercase"
            >
              My Orders
            </Link>
          </Accordion>
        </div>
        <SheetFooter className="border-t border-border flex-row sm:justify-start px-6 md:px-10 py-4">
          <Button
            variant="ghost"
            asChild
            className="text-inherit hover:bg-transparent transition-none px-0"
          >
            <Link href="/sign-in">
              <UserRound /> <span className="text-xs font-normal">Account</span>
              <span className="sr-only">Sign In</span>
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
