import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';

export default function ProductSearchBar({ value, onChange }) {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute inset-y-2 left-2" />

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="상품 검색..."
          className="w-full rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue"
        />
      </div>
    </div>
  );
}
