"use client";

export default function RevalidateButton() {
  const handleRevalidate = async () => {
    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tag: "products-base", // change to what you want to revalidate
      }),
    });
    const data = await res.json();
    alert("✅ Revalidated products.");
    console.log(data);
  };

  return (
    <button
      onClick={handleRevalidate}
      className="bg-green-600 hover:bg-green-700 text-white text-sm tracking-wider font-medium uppercase px-4 py-2 rounded fixed bottom-4 right-4"
    >
      Revalidate Cache - dev only
    </button>
  );
}
