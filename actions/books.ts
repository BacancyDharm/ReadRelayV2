'use server'
import { z} from "zod"
import { getBookById, searchBooks } from "@/lib/google-books/server"
import { createClient } from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin"
import { cookies } from "next/headers";
import { GoogleBooksResponse, BookItem,Book } from "@/types/books";
export async function searchBook(query: string) : Promise<{
    books: BookItem[], error?: string
}> {
    if(!query || query.trim().length < 2){
        return {
            books: []
        }
    }

    try {
        const {books, error} = await searchBooks(query.trim());
        return {books, error};
    } catch (error) {
        return {error: "Search failed, Try again.", books: []}
    }
}

const addBookSchema = z.object({
    clubId: z.uuid(),
    googleVolumeId: z.string(),
}) 

export async function addBookToClub(formData: z.infer<typeof addBookSchema>){
    const parsed = addBookSchema.safeParse(formData);
    if(!parsed.success) return {error: 'Invalid data'}

    const {clubId, googleVolumeId} = parsed.data;

    const supabase = createClient(cookies());
    
    const {data: {user}} = await supabase.auth.getUser()
    if(!user) return {error: "not authenticated"};

    const {data: club} = await supabase.from('clubs').select('id, leader_id').eq('id', clubId).single();

    if(!club) return {error: "club not found"}

    const {data: profile} = await supabase.from('users').select('id').eq('id', user.id).single();

    if(club.leader_id !== profile?.id) return {error: "You are not the leader of this club"};

    const {data: existingBook} = await supabaseAdmin.from('books').select('id').eq('google_volume_id', googleVolumeId).single();
    
    let bookId: string;
    
    if(existingBook){
        bookId = existingBook.id;
    }else{
         const googleBook = await getBookById(googleVolumeId);
        if(!googleBook) return {error: "Book not found"};
        const {data: newBook, error: bookError} = await supabaseAdmin.from('books').insert({
            google_volume_id: googleBook.id,
            isbn_13: googleBook.volumeInfo.industryIdentifiers![0].identifier,
            isbn_10: googleBook.volumeInfo.industryIdentifiers![1]?.identifier,
            title: googleBook.volumeInfo.title,
            authors: googleBook.volumeInfo.authors!,
            description: googleBook.volumeInfo.description,
            page_count: googleBook.volumeInfo.pageCount,
            cover_url: googleBook.volumeInfo.imageLinks?.thumbnail,
        }).select('id').single();

        if(bookError) return {error: 'Failed to save book'};
        bookId = newBook?.id
    }

    const {data: checkExistingBook} = await supabase.from('book_club_status').select('id').eq('club_id', clubId).eq('book_id', bookId).single();

    if(checkExistingBook) return {message: "Book already added to this club"}     

    const {error: clubBookError} = await supabase.from('book_club_status').insert({
        club_id: clubId,
        book_id: bookId,
        status: 'going',
    })

    if(clubBookError) {
        return {error: clubBookError.message}
    }

    return {success: true}


}

export async function getCurrentBook(clubId:string) : Promise<{book: Book | null}> {
    const supabase = createClient(cookies());

    const {data, error} = await supabase
        .from('book_club_status')
        .select(`id, status, added_at, books (id, title, authors, description, page_count, cover_url, isbn_13)`).eq('club_id', clubId).eq('status', 'going').single();
        console.log("currentbook is ",data)
        if(error) return { book : null}
        return {book: data}
}