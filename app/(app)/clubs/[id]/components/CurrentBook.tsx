type Book = {
  title: string
  authors: string[]
  description: string | null
  page_count: number | null
  cover_url: string | null
}

export default function CurrentBook({
  book,
  isLeader,
  onChangeBook,
}: {
  book: Book
  isLeader: boolean
  onChangeBook: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          Currently Reading
        </span>
        {isLeader && (
          <button
            onClick={onChangeBook}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Change
          </button>
        )}
      </div>

      {/* Cover image */}
      {book.cover_url && (
        <div className="mb-4 flex justify-center">
          <img
            src={book.cover_url}
            alt={book.title}
            className="h-40 w-auto rounded shadow-md object-cover"
          />
        </div>
      )}

      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
        {book.title}
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">{book.authors}</p>

      {book.page_count && (
        <p className="text-xs text-gray-400 mt-1">{book.page_count} pages</p>
      )}

      {book.description && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed">
          {book.description}
        </p>
      )}
    </div>
  )
}