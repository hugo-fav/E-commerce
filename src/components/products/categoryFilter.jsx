"use client";

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-12">
      {/* All */}
      <button
        onClick={() => onSelect("all")}
        className={`px-4 py-2 text-[13px] uppercase tracking-wide rounded-full transition-all duration-200
          ${
            selected === "all"
              ? "bg-purple-100 text-purple-900 font-medium"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
          }
        `}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`px-4 py-2 text-[13px] uppercase tracking-wide rounded-full transition-all duration-200
            ${
              selected === cat.slug
                ? "bg-purple-100 text-purple-900 font-medium"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
            }
          `}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
