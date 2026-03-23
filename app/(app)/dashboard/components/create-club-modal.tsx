'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClub } from '@/actions/clubs'

const GENRES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'History', 'Fantasy', 'Biography', 'Self-Help']

const schema = z.object({
  name: z.string().min(3, 'At least 3 characters').max(80, 'Max 80 characters'),
  description: z.string().max(500).optional(),
  is_public: z.boolean(),
  max_members: z.coerce.number().min(2).max(100).default(20),
})

type FormData = z.input<typeof schema>

type Club = {
  id: string
  name: string
  slug: string
  description: string | null
  is_public: boolean
  max_members: number
  genre_tags: string[]
  created_at: string
}

export default function CreateClubModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (club: Club) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_public: true, max_members: 20 },
  })

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    const result = await createClub({
      ...data,
      genre_tags: selectedGenres,
      max_members: Number(data.max_members),
    })

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    onCreated({
      id: result.club!.id,
      name: data.name,
      slug: result.club!.slug,
      description: data.description ?? null,
      is_public: data.is_public,
      max_members: Number(data.max_members) ,
      genre_tags: selectedGenres,
      created_at: new Date().toISOString(),
    })
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal — stop click propagation so clicking inside doesn't close */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Create a club</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Club name</label>
            <input
              {...register('name')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Claire's Fiction Club"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="A monthly fiction club..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max members</label>
              <input
                {...register('max_members')}
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 mt-5">
              <input
                {...register('is_public')}
                type="checkbox"
                id="is_public"
                className="rounded"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">Public club</label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}