import { BookItem, GoogleBooksResponse } from "@/types/books"

const API_key = process.env.GOOGLE_BOOKS_API_KEY!
const BASE_URL = 'https://www.googleapis.com/books/v1'

export async function searchBooks(query: string) {
    const url = `${BASE_URL}/volumes?q=${encodeURIComponent(query)}&key=${API_key}&maxResults=8`

    try {
        const res = await fetch(url)
        if(!res.ok) return {books: [], error: "Search failed, Try again."}
        const data: GoogleBooksResponse = await res.json();
        return {books: data.items}
    } catch (error) {
        return { books: [], error: "Search failed, Try again." }
    }
}

export async function getBookById (volumeId: string) : Promise<BookItem | null>{
    const url = `${BASE_URL}/volumes/${volumeId}?key=${API_key}`

    const res = await fetch(url)
    if(!res.ok){
    return null
    }
    const data: BookItem = await res.json()
    return data
}