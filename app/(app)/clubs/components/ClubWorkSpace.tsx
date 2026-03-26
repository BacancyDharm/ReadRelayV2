"use client";
import type { Book } from "@/types/books";
import SearchBar from "./SearchBar";
import CurrentBook from "./CurrentBook";
import { useState } from "react";
import Link from "next/link";
type Club = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
};

const ClubWorkSpace = ({
  club,
  initialBook,
  isLeader,
}: {
  club: Club;
  initialBook: Book;
  isLeader: boolean;
}) => {
  const [currentBook, setCurrentBook] = useState<Book>(initialBook);
  const [showBookSearch, setShowBookSearch] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-semibold text-gray-900">{club.name}</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {currentBook ? (
              <CurrentBook
                book={currentBook.books}
                isLeader={isLeader}
                onChangeBook={() => setShowBookSearch(true)}
              />
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6 text-center">
                <div className="text-4xl mb-3">📖</div>
                <p className="text-sm text-gray-500 mb-4">
                  No book selected yet
                </p>
                {isLeader && (
                  <button
                    onClick={() => setShowBookSearch(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add a book
                  </button>
                )}
              </div>
            )}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-1">
                  {club.name}
                </h2>
                {club.description && (
                  <p className="text-sm text-gray-500">{club.description}</p>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </main>

      {showBookSearch && (
        <SearchBar
          clubId={club.id}
          onClose={() => setShowBookSearch(false)}
          onBookAdded={(book) => {
            setCurrentBook(book);
            setShowBookSearch(false);
          }}
        />
      )}
    </div>
  );
};

export default ClubWorkSpace;
