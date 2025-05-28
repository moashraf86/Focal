import Cart from "@/components/cart/Cart";

export const metadata = {
  title: "Cart",
  description: "View and manage your shopping cart.",
};

export default function CartPage() {
  return (
    <main className="space-y-20 pt-10 pb-20">
      <Cart />
    </main>
  );
}
