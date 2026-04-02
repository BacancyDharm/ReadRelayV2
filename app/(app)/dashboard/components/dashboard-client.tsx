"use client";

import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import CreateClubModal from "./create-club-modal";
import ClubCard from "./club-card";
import Header from "@/components/Header";

type Club = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  max_members: number;
  genre_tags: string[];
  created_at: string;
};

export default function DashboardClient({
  initialClubs,
}: {
  initialClubs: Club[];
}) {
  const { user } = useUser();
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleClubCreated = (newClub: Club) => {
    setClubs((prev) => [...prev, newClub]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
     <Header name={user?.name || ""} />
      <main className="max-w-5xl mx-auto px-4 py-8">
         <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Clubs</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    + New Club
                  </button>
                </div>
                {clubs.length === 0 && (
                          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              No clubs yet
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                              Create your first book club to get started.
                            </p>
                            <button
                              onClick={() => setShowCreateModal(true)}
                              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Create a club
                            </button>
                          </div>
                        )}
                        {clubs.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {clubs.map(club => (
                                      <ClubCard key={club.id} club={club} />
                                    ))}
                                  </div>
                                )}
      </main>
      {showCreateModal && (
              <CreateClubModal
                onClose={() => setShowCreateModal(false)}
                onCreated={handleClubCreated}
              />
            )}
    </div>
  );
}
