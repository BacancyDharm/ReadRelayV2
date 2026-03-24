"use client";
import { searchBook } from "@/actions/books";
import { useRef, useState } from "react";

type ResType = {
  kind: string;
  totalItems: number;
  items: any[];
};

const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);

  const [searchData, setSearchData] = useState<ResType>({
    kind: "",
    totalItems: 0,
    items: [],
  });

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!ref.current) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const { books } = await searchBook(ref.current.value);
      setSearchData(books);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Search Bar */}
      <div className="w-full max-w-xl flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search for books..."
          ref={ref}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Skeleton Loader */}
      {loading && (
        <div className="w-full max-w-4xl grid gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 bg-white p-4 rounded-2xl shadow-md animate-pulse"
            >
              <div className="w-24 h-32 bg-gray-300 rounded-lg" />

              <div className="flex flex-col gap-3 w-full">
                <div className="h-5 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hasSearched && searchData.items.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg font-medium">No books found 📚</p>
          <p className="text-sm">Try searching with a different keyword.</p>
        </div>
      )}

      {/* Results */}
      {!loading && searchData.items.length > 0 && (
        <div className="w-full max-w-4xl grid gap-6">
          {searchData.items.map((book: any) => (
            <div
              key={book.id}
              className="flex gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="w-24 h-32 shrink-0">
                <img
                  src={
                    book.volumeInfo.imageLinks?.smallThumbnail ||
                    "/placeholder.png"
                  }
                  alt={book.volumeInfo.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {book.volumeInfo.title}
                </h2>

                <p className="text-sm text-gray-600">
                  {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                </p>

                <p className="text-sm text-gray-500 line-clamp-3">
                  {book.volumeInfo.description ||
                    "No description available."}
                </p>

                <p className="text-sm font-medium text-gray-700">
                  Pages: {book.volumeInfo.pageCount || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;