"use client";

export default function RevalidateButton() {
  const handleRevalidate = async () => {
    const tag = window.prompt("Enter tag to revalidate:");
    if (!tag) return;
    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tag: tag,
      }),
    });
    const data = await res.json();
    alert(`✅ Revalidated ${tag}.`);
    console.log(data);
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <button
        onClick={handleRevalidate}
        className="bg-green-600 hover:bg-green-700 text-white text-sm tracking-wider font-medium uppercase px-4 py-2 rounded"
      >
        Revalidate Cache
      </button>
    </div>
  );
}
