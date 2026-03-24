import { searchBooks } from "@/lib/google-books/client"


export async function searchBook(query: string) {
    if(!query || query.trim().length < 2){
        return {
            books: []
        }
    }

    try {
        const books = await searchBooks(query.trim());
        return {books};
    } catch (error) {
        return {error: "Search failed, Try again.", books: []}
    }
}