"use client";
import { addBookToClub, searchBook } from "@/actions/books";
import { BookItem } from "@/types/books";
import { useEffect, useRef, useState } from "react";



const SearchBar = ({
  clubId,
  onClose,
  onBookAdded,
}: {
  clubId: string;
  onClose: () => void;
  onBookAdded: (book: any) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookItem[]>();
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debouncedRef = useRef<NodeJS.Timeout>("" as unknown as NodeJS.Timeout);

  useEffect(() => {
    if (!query.trim()) {
      setResults(undefined);
      return;
    }

    clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      const { books, error } = await searchBook(query);
      setResults(books ?? []);
      if (error) setError(error);
      setIsSearching(false);
    }, 400);

    return () => {
      clearTimeout(debouncedRef.current);
    };
  }, [query]);

  const handleSelectBook = async (book: BookItem) => {
    setIsAdding(book.id);
    setError(null);


    const result = await addBookToClub({
      clubId,
      googleVolumeId: book.id,
    });

    if (result.error) {
      setError(result.error);
      setIsAdding(null);
      return;
    }

    onBookAdded({
      status: "going",
      books: {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors,
        description: book.volumeInfo.description,
        page_count: book.volumeInfo.pageCount,
        cover_url: book.volumeInfo.imageLinks?.thumbnail,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Add a book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search by title, author, or ISBN..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="p-3 max-h-[60vh] overflow-y-auto">

          {isSearching && (
            <div className="text-center py-8 text-sm text-gray-400">
              Searching...
            </div>
          )}

          {!isSearching && query && results && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                No books found for "{query}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different title or author name
              </p>
            </div>
          )}

          
          {!query && (
            <div className="text-center py-8 text-sm text-gray-400">
              Type a book title to search
            </div>
          )}

          {results && results.map((book) => (
            <div
              key={book.id}
              className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {/* Cover */}
              <div className="shrink-0">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                    No cover
                  </div>
                )}
              </div>

              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {book.volumeInfo.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{book.volumeInfo.authors}</p>

                <p className="text-xs text-gray-400 mt-0.5">
                  {book.volumeInfo.pageCount} pages
                </p>
              </div>

              
              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => handleSelectBook(book)}
                  disabled={isAdding === book.id}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isAdding === book.id ? "Adding..." : "Select"}
                </button>
              </div>
            </div>
          ))}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
