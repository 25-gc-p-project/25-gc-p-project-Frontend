export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const MAX_VISIBLE = 7;

  const generatePageNumbers = () => {
    if (totalPages <= MAX_VISIBLE) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];

    const first = 1;
    const last = totalPages;

    pages.push(first);

    if (currentPage > 4) {
      pages.push("left-ellipsis");
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let p = start; p <= end; p++) {
      pages.push(p);
    }

    if (currentPage < totalPages - 3) {
      pages.push("right-ellipsis");
    }

    pages.push(last);

    return pages;
  };

  const pages = generatePageNumbers();

  const handleClick = (page) => {
    if (typeof page !== "number") return;
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div
      className={
        "mt-6 flex items-center justify-center gap-2 text-sm " + className
      }
    >
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-10 w-10 rounded border text-center ${
          currentPage === 1
            ? "cursor-not-allowed border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
      >
        &lt;
      </button>

      {pages.map((page, idx) =>
        page === "left-ellipsis" || page === "right-ellipsis" ? (
          <span
            key={page + idx}
            className="mx-1 select-none text-gray-400 px-1"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handleClick(page)}
            className={`h-10 min-w-10 rounded border px-2 text-center ${
              currentPage === page
                ? "border-orange-400 bg-orange-400 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-10 w-10 rounded border text-center ${
          currentPage === totalPages
            ? "cursor-not-allowed border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
      >
        &gt;
      </button>
    </div>
  );
}
