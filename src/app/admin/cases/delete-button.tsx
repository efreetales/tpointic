"use client";

export function DeleteCaseButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Remover este case permanentemente?")) {
          e.preventDefault();
        }
      }}
      className="rounded-full border border-red-300 px-6 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
    >
      Remover case
    </button>
  );
}
