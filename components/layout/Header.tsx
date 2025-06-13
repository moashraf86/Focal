"use client";
import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
import { useMeasure, useWindowScroll } from "@uidotdev/usehooks";
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

const categories = [
  {
    id: 0,
    name: "Men",
    href: "/categories/men",
  },
  {
    id: 1,
    name: "Women",
    href: "/categories/women",
  },
  {
    id: 2,
    name: "Straps & Bands",
    href: "/categories/straps-bands",
  },
  {
    id: 3,
    name: "Gifts & Pouches",
    href: "/categories/gifts-pouches",
  },
  {
    id: 4,
    name: "All",
    href: "/categories",
  },
];

const faces = [
  {
    id: 0,
    name: "1815",
    icon: "https://res.cloudinary.com/daswys0i8/image/upload/v1749831232/1815_560x.jpg_v_1633095899_acgika.jpg",
    href: "/faces/1815",
  },
  {
    id: 1,
    name: "1820",
    icon: "https://res.cloudinary.com/daswys0i8/image/upload/v1749831233/1820_560x.jpg_v_1633095906_tjgx5r.jpg",
    href: "/faces/1820",
  },
  {
    id: 2,
    name: "1844",
    icon: "https://res.cloudinary.com/daswys0i8/image/upload/v1749831232/1844_560x.jpg_v_1633095912_jgoddv.jpg",
    href: "/faces/1844",
  },
  {
    id: 3,
    name: "1926",
    icon: "https://res.cloudinary.com/daswys0i8/image/upload/v1749831233/1926_560x.jpg_v_1633095918_orhpyn.jpg",
    href: "/faces/1926",
  },
  {
    id: 4,
    name: "1969",
    icon: "https://res.cloudinary.com/daswys0i8/image/upload/v1749831232/1969_560x.jpg_v_1633095923_clfhkc.jpg",
    href: "/faces/1969",
  },
  {
    id: 5,
    name: "1971",
    icon: "https://res.cloudinary.com/daswys0i8/image/upload/v1749831233/1971_560x.jpg_v_1633095928_axlyot.jpg",
    href: "/faces/1971",
  },
];

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
                      All Faces
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
          <Button
            variant="ghost"
            size="icon"
            className="text-inherit hover:bg-transparent"
          >
            <span className="sr-only">Toggle menu</span>
            <Menu />
          </Button>
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
