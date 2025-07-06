"use client";
import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
import { useWindowScroll } from "@uidotdev/usehooks";
import Logo from "../shared/Logo";
import { useEffect, useState } from "react";
import { useSearchDrawer } from "@/hooks/useSearchDrawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import MobileMenu from "../shared/MobileMenu";
import { categories, faces } from "@/lib/constants";

export default function Header() {
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { cartItems, getTotalItems } = useCart();
  const isSignedIn = !!user;
  const [{ y: scrollY }] = useWindowScroll();
  const isHomePage = pathname === "/";
  const { open } = useSearchDrawer();

  useEffect(() => {
    // Ensure the component has mounted before applying styles
    setHasMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "bg-transparent text-primary-foreground sticky top-0 left-0 right-0 z-50 hover:bg-background hover:text-foreground border-b border-transparent group transition-colors duration-300 ease-in-out h-20 content-center",
        scrollY &&
          scrollY > 20 &&
          "bg-background text-foreground border-border",
        isHomePage ? "-mt-20" : "",
        !isHomePage &&
          "sticky top-0 bg-background text-foreground border-border"
      )}
    >
      <div className="mx-auto flex max-w-screen-xl items-center px-4 lg:px-8">
        {/* Navigation */}
        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">
                Shop
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px]">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className="w-full py-1.5 px-3 hover:bg-accent"
                    >
                      <NavigationMenuLink
                        className="block w-full"
                        href={category.href}
                      >
                        {category.name}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">
                Faces
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1">
                  {faces.map((face) => (
                    <li
                      key={face.id}
                      className="w-full py-1.5 px-3 hover:bg-accent pl-0"
                    >
                      <NavigationMenuLink
                        className="block w-full"
                        href={face.href}
                      >
                        <Image
                          src={face.icon}
                          alt={`${face.name} icon`}
                          width={64}
                          height={64}
                          className="inline-block mr-2 mix-blend-multiply"
                        />
                        {face.name}
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="w-full py-1.5 px-3 hover:bg-accent">
                    <NavigationMenuLink className="block w-full" href="/faces">
                      Shop All Faces
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn("bg-transparent", navigationMenuTriggerStyle())}
              >
                <Link href="/orders">My Orders</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* Menu Toggler */}
        <div className="flex items-center gap-2 lg:hidden">
          <MobileMenu />
          <Button
            variant="ghost"
            size="icon"
            className="text-inherit hover:bg-transparent"
            onClick={() => open()}
          >
            <span className="sr-only">Open Search Drawer</span>
            <Search />
          </Button>
        </div>
        {/* Logo */}
        <Logo
          className={cn(
            "absolute left-1/2 transform -translate-x-1/2",
            (scrollY && scrollY > 20) || !isHomePage ? "invert" : "",
            isHomePage ? "group-hover:invert" : ""
          )}
        />
        {/* Actions */}
        <div className="flex items-center flex-1 justify-end">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-inherit hover:bg-transparent hidden lg:flex"
              onClick={() => open()}
            >
              <span className="sr-only">Open Search Drawer</span>
              <Search />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative text-inherit hover:bg-transparent transition-none"
            >
              <Link href="/cart">
                <span className="sr-only">View Cart</span>
                <ShoppingBag />
                {cartItems?.length > 0 && hasMounted && (
                  <div className="absolute top-0 -right-1 flex items-center justify-center min-w-4 min-h-4 px-1 font-medium text-white bg-primary rounded-full">
                    <span className="inline text-[9px] leading-[.75rem] indent-0.5">
                      {getTotalItems()}
                    </span>
                  </div>
                )}
              </Link>
            </Button>
            {isSignedIn && hasMounted && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative text-inherit hover:bg-transparent transition-none"
              >
                <div>
                  <span className="sr-only">User Menu</span>
                  <UserButton afterSwitchSessionUrl="/sign-in" />
                </div>
              </Button>
            )}

            {!isSignedIn && hasMounted && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-inherit hover:bg-transparent transition-none"
              >
                <Link href="/sign-in">
                  <span className="sr-only">Sign In</span>
                  <UserRound />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
