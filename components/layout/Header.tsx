"use client";
import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
import { useMeasure, useWindowScroll } from "@uidotdev/usehooks";
import Logo from "../shared/Logo";
import { useEffect, useState } from "react";
import { useSearchDrawer } from "@/hooks/useSearchDrawer";

export default function Header() {
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { cartItems, getTotalItems } = useCart();
  const isSignedIn = !!user;
  const [{ y: scrollY }] = useWindowScroll();
  const [ref, { height }] = useMeasure();
  const isHomePage = pathname === "/";
  const { open } = useSearchDrawer();

  useEffect(() => {
    // Ensure the component has mounted before applying styles
    setHasMounted(true);
  }, []);

  return (
    <header
      ref={ref}
      style={
        isHomePage && hasMounted ? { marginBottom: `-${height}px` } : undefined
      }
      className={cn(
        "bg-transparent text-primary-foreground sticky top-0 left-0 right-0 z-50 hover:bg-background hover:text-foreground border-b border-transparent group transition-colors duration-300 ease-in-out",
        scrollY &&
          scrollY > 20 &&
          "bg-background text-foreground border-border",
        !isHomePage &&
          "sticky top-0 bg-background text-foreground border-border"
      )}
    >
      <div className="mx-auto flex max-w-screen-xl items-center px-4 lg:px-8 py-5 md:py-6">
        {/* Navigation */}
        <nav aria-label="Global" className="flex-1">
          <ul className="hidden lg:flex items-center gap-6 text-sm">
            <li>
              <Link className="text-inherit text-[15px]" href="/categories">
                Shop
              </Link>
            </li>

            <li>
              <Link className="text-inherit text-[15px]" href="#">
                Collections
              </Link>
            </li>
            <li>
              <Link className="text-inherit text-[15px]" href="/orders">
                My Orders
              </Link>
            </li>
          </ul>
          {/* Menu Toggler */}
          <Button
            variant="ghost"
            size="icon"
            className="text-inherit lg:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="!size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </nav>
        {/* Logo */}
        <Logo
          className={cn(
            (scrollY && scrollY > 20) || !isHomePage ? "invert" : "",
            isHomePage ? "group-hover:invert" : ""
          )}
        />
        {/* Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex gap-5">
            <Button
              variant="ghost"
              className="flex justify-center items-center size-7 text-inherit hover:bg-transparent"
              onClick={() => open()}
            >
              <Search className="block size-5 text-inherit" />
            </Button>

            <Link
              href="/cart"
              className="relative flex justify-center items-center size-7 text-inherit"
            >
              <ShoppingBag className="block size-5 text-inherit" />
              <span>
                {cartItems?.length > 0 && hasMounted && (
                  <span className="absolute top-0 -right-1 flex items-center justify-center min-w-4 min-h-4 ps-1 pe-1 text-[9px] font-medium text-white bg-primary rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </span>
            </Link>
            {isSignedIn && hasMounted && (
              <UserButton afterSwitchSessionUrl="/sign-in" />
            )}

            {!isSignedIn && hasMounted && (
              <Link
                href="/sign-in"
                className="flex justify-center items-center size-7 text-inherit"
              >
                <UserRound className="block size-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
