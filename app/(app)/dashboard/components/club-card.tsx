import Link from 'next/link'

type Club = {
  id: string
  name: string
  slug: string
  description: string | null 
  is_public: boolean
  genre_tags: string[]
}

export default function ClubCard({ club }: { club: Club }) {
  return (
    <Link href={`/clubs/${club.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{club.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            club.is_public
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {club.is_public ? 'Public' : 'Private'}
          </span>
        </div>

        {club.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {club.description}
          </p>
        )}

        {club.genre_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {club.genre_tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}