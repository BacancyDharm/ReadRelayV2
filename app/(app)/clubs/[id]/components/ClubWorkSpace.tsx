"use client";
import type { Book } from "@/types/books";
import SearchBar from "./SearchBar";
import CurrentBook from "./CurrentBook";
import { useState } from "react";
import Link from "next/link";
import ScheduleDisplay from "./ScheduleDisplay";
import ScheduleForm from "./ScheduleForm";
import MembersTab from "./MembersTab";
type Club = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
};

type Tab = "schedule" | "members" | "discussion";

type Section = {
  id: string;
  section_number: number;
  title: string | null;
  start_page: number;
  end_page: number;
  deadline: string;
};

const ClubWorkSpace = ({
  club,
  initialBook,
  initialSections,
  isLeader,
  initialMembers,
  initialInvitations
}: {
  club: Club;
  initialBook: Book;
  initialSections: Section[];
  isLeader: boolean;
  initialMembers: any[];
  initialInvitations: any[]
}) => {
  const [currentBook, setCurrentBook] = useState<Book>(initialBook);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("schedule");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [members, setMembers] = useState(initialMembers)
  const [invitations, setInvitations] = useState(initialInvitations)

  const clubBookId = currentBook?.id ?? null;
  const pageCount = currentBook?.books.page_count ?? 0;


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
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
              {(["schedule", "members", "discussion"] as Tab[]).map((tab) => (
                <button
                  className="{`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                                      activeTab === tab
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "schedule" && (
              <div>
                {showScheduleForm && clubBookId ? (
                  <ScheduleForm
                    clubBookId={clubBookId}
                    pageCount={pageCount}
                    onSuccess={() => {
                      setShowScheduleForm(false);
                      
                      window.location.reload();
                    }}
                    onCancel={() => setShowScheduleForm(false)}
                  />
                ) : sections.length > 0 ? (
                  <ScheduleDisplay
                    sections={sections}
                    isLeader={isLeader}
                    onEdit={() => setShowScheduleForm(true)}
                  />
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-sm text-gray-500 mb-4">
                      {currentBook
                        ? "No reading schedule yet"
                        : "Add a book first to create a schedule"}
                    </p>
                    {isLeader && currentBook && (
                      <button
                        onClick={() => setShowScheduleForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Create schedule
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === "members" && (
            <MembersTab
              clubId={club.id}
              initialMembers={members}
              initialInvitations={invitations}
              isLeader={isLeader}
            />
            )}
            {activeTab === "discussion" && (
              <p>Discussion</p>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">{club.name}</h2>
              {club.description && (
                <p className="text-sm text-gray-500">{club.description}</p>
              )}
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
